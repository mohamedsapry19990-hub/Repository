/*************************************************
 * Employee Registration System - Fixed Backend
 *************************************************/

// ID جدول البيانات المباشر المربوط
const SPREADSHEET_ID = "1Euvi-yQkMNkl-TLyyUM_d8nWGSOAljD1D10xXyWJkY0";

const FRONT_FOLDER = "1H1jfc9k6sQiMyCYkMwDVir8-Dnip46tH";
const BACK_FOLDER = "1FDBKZeYaxK7DTJTkuPZAEbssbGFACoQG";
const PERMIT_FOLDER = "1bhsDD9ixWmitQG1iqvmxSBW01IQF63Eb";
const CV_FOLDER = "1mI2LBcFky6arGnraQzaGdJ4dSOAnM8Tr"; // مجلد الـ CV
const ERROR_FOLDER = "14gmbLutEbw7UFEM24SpQHi3hcbYmmXh4"; // مجلد الممانعة (Error)

// كلمة سر لوحة تحكم الأدمن
const ADMIN_PASSWORD = "GPS@2026Admin";

function doGet(e){
  e = e || {};
  e.parameter = e.parameter || {};

  const page = e.parameter.page || "index";
  let template;

  if(page === "register"){
    template = HtmlService.createTemplateFromFile("register");
  } else if(page === "search"){
    template = HtmlService.createTemplateFromFile("search");
  } else if(page === "permit"){
    template = HtmlService.createTemplateFromFile("permit");
  } else if(page === "renew"){
    template = HtmlService.createTemplateFromFile("renew");
  } else if(page === "dashboard"){
    template = HtmlService.createTemplateFromFile("dashboard");
  } else {
    template = HtmlService.createTemplateFromFile("index");
  }

  template.scriptUrl = ScriptApp.getService().getUrl();

  return template.evaluate()
    .setTitle("GPS شركه")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(file){
  return HtmlService.createHtmlOutputFromFile(file).getContent();
}

function generateID(){
  return Utilities.getUuid();
}

function nationalExists(nationalId){
  if (!nationalId) return false;
  const sheet = getSheet();
  const data = sheet.getDataRange().getDisplayValues();
  const targetNatId = String(nationalId).replace(/\D/g, "").trim();

  if (!targetNatId) return false;

  for(let i = 1; i < data.length; i++){
    let sheetNatId = String(data[i][3] || "").replace(/\D/g, "").trim();
    if(sheetNatId === targetNatId){
      return true;
    }
  }
  return false;
}

function uploadImage(base64Data, fileName, folderId){
  if(!base64Data) return "";

  // تنظيف صيغة Base64 مهما كان نوع الملف
  const cleanedBase64 = base64Data.replace(/^data:[^;]+;base64,/, "");
  const folder = DriveApp.getFolderById(folderId);
  const bytes = Utilities.base64Decode(cleanedBase64);
  
  // تحديد نوع الملف (صورة أم مستند PDF)
  let mimeType = "image/jpeg";
  if (fileName.toLowerCase().endsWith(".pdf")) {
    mimeType = "application/pdf";
  } else if (fileName.toLowerCase().endsWith(".png")) {
    mimeType = "image/png";
  }
  
  const blob = Utilities.newBlob(bytes, mimeType, fileName);

  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return "https://lh3.googleusercontent.com/d/" + file.getId();
}

function saveData(data){
  try{
    if(nationalExists(data.nationalId)){
      return { status: false, message: "الرقم القومي مسجل بالفعل!" };
    }

    const personName = (data.name || "موظف").toString().trim().replace(/[/\\?%*:|<>"']/g, "");

    const frontUrl = uploadImage(data.frontImage, personName + " - وجه أمامي.jpg", FRONT_FOLDER);
    const backUrl = uploadImage(data.backImage, personName + " - وجه خلفي.jpg", BACK_FOLDER);
    
    let permitUrl = "";
    if(data.permitImage){
      permitUrl = uploadImage(data.permitImage, personName + " - تصريح.jpg", PERMIT_FOLDER);
    }

    let cvUrl = "";
    if(data.cvImage){
      let cvExt = data.cvImage.includes("application/pdf") ? ".pdf" : ".jpg";
      cvUrl = uploadImage(data.cvImage, personName + " - CV" + cvExt, CV_FOLDER);
    }

    let clearanceUrl = "";
    if(data.clearanceImage){
      clearanceUrl = uploadImage(data.clearanceImage, personName + " - صورة الممانعة.jpg", ERROR_FOLDER);
    }

    let permitStatus = "";          // عمود L
    let lectureStatus = "";         // عمود M للمحاضرة
    let permitSecondStatus = "";    // عمود P 
    let receiptDateStatus = "";     // عمود Q 
    let permitOStatus = "";         // عمود O
    
    let userInputCompany = (data.company || "").trim();
    let regType = (data.type || "").trim();

    let companyColumnG = userInputCompany || "-";
    let companyColumnN = ""; 

    if (regType === "تسجيل موظف جديد") {
        permitStatus = "لم يتم الحصول علي تصريح";
        lectureStatus = "لم يتم تحديد بعد"; 
        companyColumnG = "GPS";
    } else if (regType.includes("تصريح شركة تانية") || regType.includes("تقديم ومعايا تصريح")) {
        permitStatus = ""; 
        lectureStatus = "لم تحدد بعد";          
        permitSecondStatus = ""; 
        permitOStatus = "لم يتم القبول بعد"; 
        companyColumnN = userInputCompany;     
        companyColumnG = "GPS";                
    } else if (regType.includes("تجديد التصريح")) {
        permitStatus = "";
        lectureStatus = "";
        companyColumnG = userInputCompany || "GPS"; 
        permitSecondStatus = "لم يتم القبول بعد"; 
        receiptDateStatus = "لم يحدد بعد";      
    } else {
        permitStatus = ""; 
        lectureStatus = ""; 
    }

    const sheet = getSheet();
    const id = generateID();
    const formattedDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");

    // تجهيز بيانات الصف
    let rowData = [
      id,                    // A (0)
      data.type,             // B (1)
      data.name,             // C (2)
      "'" + String(data.nationalId).trim(), // D (3)
      "'" + String(data.phone).trim(),      // E (4)
      data.job,              // F (5)
      companyColumnG,        // G (6)
      frontUrl,              // H (7)
      backUrl,               // I (8)
      permitUrl,             // J (9)
      formattedDate,         // K (10)
      permitStatus,          // L (11)
      lectureStatus,         // M (12)
      companyColumnN,        // N (13)
      permitOStatus,         // O (14)
      permitSecondStatus,    // P (15)
      receiptDateStatus,     // Q (16)
      ""                     // R (17)
    ];

    // ملء الأعمدة الفارغة حتى العمود Y (الفهرس 24) لضمان وضع الـ CV في العمود Z
    while (rowData.length < 25) {
      rowData.push("");
    }

    // إضافة رابط الـ CV في العمود Z (الفهرس 25)
    rowData.push(cvUrl);

    // إضافة رابط صورة الممانعة في العمود AA (الفهرس 26)
    rowData.push(clearanceUrl);

    sheet.appendRow(rowData);

    return { status: true, message: "تم حفظ البيانات بنجاح ✅" };
  } catch(err){
    return { status: false, message: "حدث خطأ: " + err.toString() };
  }
}

function searchData(nationalId){
  const sheet = getSheet();
  const data = sheet.getDataRange().getDisplayValues();

  let searchNatId = String(nationalId).replace(/\D/g, "").trim();

  if(!searchNatId) return null;

  for(let i = 1; i < data.length; i++){
    let sheetNatId = String(data[i][3] || "").replace(/\D/g, "").trim();

    if(sheetNatId === searchNatId){
      let rowType = data[i][1] || "";
      let companyG = data[i][6] || "";  
      let colL = data[i][11] || "";      
      let colM = data[i][12] || "";      
      let companyN = data[i][13] || "";  
      let colO = data[i][14] || "";      
      let colP = data[i][15] || "";      
      let colQ = data[i][16] || "";      

      let storedCompany = companyG;
      let newCompanyValue = "";
      let finalPermitStatus = colL;
      let finalLectureStatus = colM;

      if (regTypeCheck(rowType)) {
        storedCompany = companyG;
        newCompanyValue = companyN;
        finalPermitStatus = colO || colL;
        finalLectureStatus = colP || colM;
      } else if (rowType.includes("تجديد")) {
        finalPermitStatus = colP || colL;
        finalLectureStatus = colQ || colM;
      }

      return {
        id: data[i][0],
        type: data[i][1],
        name: data[i][2],
        nationalId: sheetNatId,
        phone: String(data[i][4] || "").replace(/\D/g, "").trim(),
        job: data[i][5],
        company: storedCompany,      
        newCompany: newCompanyValue,  
        front: data[i][7],
        back: data[i][8],
        permit: data[i][9],
        date: data[i][10],
        permitStatus: finalPermitStatus ? String(finalPermitStatus).trim() : "",
        lectureStatus: finalLectureStatus ? String(finalLectureStatus).trim() : "",
        cv: data[i][25] || "",
        clearance: data[i][26] || ""
      };
    }
  }
  return null;
}

function getSheet(){
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheets()[0];
  if(!sheet){
    throw new Error("لم يتم العثور على أي ورقة داخل جدول البيانات المرفق!");
  }
  return sheet;
}

function regTypeCheck(rowType) {
  return rowType.includes("تصريح شركة تانية") || rowType.includes("تقديم ومعايا تصريح");
}

/*************************************************
 * لوحة تحكم الأدمن - إحصائيات مجمعة من الشيت
 *************************************************/
function getDashboardStats(password){
  try{
    if(String(password) !== String(ADMIN_PASSWORD)){
      return { status: false, message: "كلمة السر غير صحيحة ❌" };
    }

    const sheet = getSheet();
    const data = sheet.getDataRange().getDisplayValues();

    const categories = {
      newEmployee: { label: "تسجيل موظف جديد", total: 0, jobs: {} },
      otherCompanyPermit: { label: "تقديم ومعايا تصريح شركة تانية", total: 0, jobs: {} },
      renewPermit: { label: "تجديد التصريح", total: 0, jobs: {} },
      other: { label: "أنواع أخرى / غير مصنفة", total: 0, jobs: {} }
    };

    for(let i = 1; i < data.length; i++){
      const row = data[i];
      const nationalId = (row[3] || "").toString().trim();
      if(!nationalId) continue;

      const type = (row[1] || "").toString().trim();
      const job = (row[5] || "").toString().trim() || "غير محدد";

      let key = "other";
      if(type.includes("تسجيل موظف جديد")){
        key = "newEmployee";
      } else if(type.includes("تصريح شركة تانية") || type.includes("تقديم ومعايا تصريح")){
        key = "otherCompanyPermit";
      } else if(type.includes("تجديد")){
        key = "renewPermit";
      }

      categories[key].total++;
      categories[key].jobs[job] = (categories[key].jobs[job] || 0) + 1;
    }

    const orderedKeys = ["newEmployee", "otherCompanyPermit", "renewPermit", "other"];
    const result = orderedKeys.map(function(key){
      const cat = categories[key];
      const jobsArr = Object.keys(cat.jobs).map(function(j){
        return { job: j, count: cat.jobs[j] };
      }).sort(function(a, b){ return b.count - a.count; });

      return { key: key, label: cat.label, total: cat.total, jobs: jobsArr };
    });

    const totalAll = result.reduce(function(sum, c){ return sum + c.total; }, 0);

    return { status: true, totalAll: totalAll, categories: result };
  } catch(err){
    return { status: false, message: "حدث خطأ: " + err.toString() };
  }
}

const API_URL = "https://script.google.com/macros/s/AKfycbwFSiuWR_Z7BYwsUQAgGcMV954QaHYSj5yQYKn9F1heSSCsAOASHHI286sZg8qwm-YV/exec";

document.addEventListener("DOMContentLoaded", function() {
    document.body.style.overflowY = "auto";
    document.body.style.paddingBottom = "100px";
    if(document.documentElement) document.documentElement.style.overflowY = "auto";

    const clearanceInput = document.getElementById("clearance");
    if (clearanceInput) {
        const uploadIds = ["front", "back", "permit", "clearance"];
        const uploadSections = [];

        uploadIds.forEach(function(id) {
            const input = document.getElementById(id);
            if (input) {
                let wrapper = input.closest(".form-group, .card, .mb-3, fieldset, .upload-section, .col");
                if (!wrapper) {
                    wrapper = input.parentElement;
                    while (wrapper && wrapper !== document.body && wrapper.children.length <= 3 && !wrapper.querySelector("input[type='text'], select, textarea")) {
                        wrapper = wrapper.parentElement;
                    }
                }
                if (wrapper) uploadSections.push(wrapper);
            }
        });

        if (uploadSections.length >= 2) {
            const grid = document.createElement("div");
            grid.className = "image-upload-grid";
            const firstSection = uploadSections[0];
            if (firstSection && firstSection.parentElement) {
                firstSection.parentElement.insertBefore(grid, firstSection);
                uploadSections.forEach(function(section) {
                    grid.appendChild(section);
                });
            }
        }
    }
});

function formatImageUrl(url) {
    if (!url) return '';
    var fileId = '';
    if (url.indexOf('id=') !== -1) {
        var match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (match && match[1]) fileId = match[1];
    } else if (url.indexOf('/d/') !== -1) {
        var match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) fileId = match[1];
    }
    if (fileId) {
        return 'https://lh3.googleusercontent.com/d/' + fileId;
    }
    return url;
}

function fileToBase64(file){
    return new Promise(function(resolve, reject){
        if(!file){
            resolve("");
            return;
        }

        if (!file.type || !file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e){ resolve(e.target.result); };
            reader.onerror = function(){ reject("Error reading file"); };
            reader.readAsDataURL(file);
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e){
            const img = new Image();
            img.onload = function(){
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const maxDim = 1200;

                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
                resolve(compressedDataUrl);
            };
            img.onerror = function(){
                resolve(e.target.result);
            };
            img.src = e.target.result;
        };
        reader.onerror = function(){ reject("Error reading file"); };
        reader.readAsDataURL(file);
    });
}

function showLoading(){
    const loading = document.getElementById("loading");
    if(loading) {
        loading.style.display = "block";
        loading.style.position = "static";
        loading.style.textAlign = "center";
        loading.style.margin = "15px auto";
        loading.style.color = "#0d6efd";
        loading.style.fontSize = "18px";
        loading.style.fontWeight = "bold";
    }
}

function hideLoading(){
    const loading = document.getElementById("loading");
    if(loading) loading.style.display = "none";
}

function showErrorBanner(msg) {
    let errBanner = document.getElementById("errorBanner");
    if (!errBanner) {
        errBanner = document.createElement("div");
        errBanner.id = "errorBanner";
        errBanner.style.background = "#ffe6e6";
        errBanner.style.color = "#dc3545";
        errBanner.style.padding = "12px";
        errBanner.style.borderRadius = "8px";
        errBanner.style.margin = "10px 0";
        errBanner.style.textAlign = "center";
        errBanner.style.fontWeight = "bold";
        const form = document.querySelector("form") || document.body;
        form.insertBefore(errBanner, form.firstChild);
    }
    errBanner.innerText = msg;
    errBanner.style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideErrorBanner() {
    const errBanner = document.getElementById("errorBanner");
    if (errBanner) errBanner.style.display = "none";
}

function showSuccessBanner(msg) {
    alert(msg || "تم الحفظ بنجاح!");
}

function getInputValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
}

function getFileInput(id) {
    const el = document.getElementById(id);
    return (el && el.files && el.files.length > 0) ? el.files[0] : null;
}

function validateRegister(requirePermit = false, requireClearance = false){
    if(typeof hideErrorBanner === "function") hideErrorBanner();

    if(!getInputValue("name")){
        if(typeof showErrorBanner === "function") showErrorBanner("أدخل الاسم بالكامل");
        return false;
    }

    const nationalId = getInputValue("nationalId");
    if(nationalId.length !== 14){
        if(typeof showErrorBanner === "function") showErrorBanner("الرقم القومي يجب أن يتكون من 14 رقم بالضبط");
        return false;
    }

    if(!getInputValue("phone")){
        if(typeof showErrorBanner === "function") showErrorBanner("أدخل رقم الهاتف");
        return false;
    }
    
    const jobVal = getInputValue("job");
    if(!jobVal){
        if(typeof showErrorBanner === "function") showErrorBanner("أدخل المهنة من القائمة");
        return false;
    }

    const supervisorsList = ['مشرف شدة', 'مشرف لحام', 'مشرف عام', 'مشرف إنشائي'];
    if(supervisorsList.includes(jobVal)){
        if(!getFileInput("cvInput")){
            if(typeof showErrorBanner === "function") showErrorBanner("رفع ملف أو صورة الـ CV إلزامي للمشرفين");
            return false;
        }
    }

    if(!getFileInput("front")){
        if(typeof showErrorBanner === "function") showErrorBanner("اختر صورة البطاقة (الوجه الأمامي)");
        return false;
    }
    if(!getFileInput("back")){
        if(typeof showErrorBanner === "function") showErrorBanner("اختر صورة البطاقة (الوجه الخلفي)");
        return false;
    }
    if(requirePermit && !getFileInput("permit")){
        if(typeof showErrorBanner === "function") showErrorBanner("اختر صورة التصريح");
        return false;
    }
    if(requireClearance && !getFileInput("clearance")){
        if(typeof showErrorBanner === "function") showErrorBanner("رفع صورة الممانعة إلزامي جداً للقبول");
        return false;
    }

    return true;
}

// دالة إرسال مضمونة تجتاز حظر CORS على الموبايل
function sendApiRequest(payload) {
    const params = new URLSearchParams();
    params.append("payload", JSON.stringify(payload));

    return fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: params
    }).then(res => res.json());
}

async function save(){
    if(!validateRegister(false, false)) return;

    showLoading();
    let cvBase64 = await fileToBase64(getFileInput("cvInput"));

    const data = {
        action: "saveData",
        type: "تسجيل موظف جديد",
        name: getInputValue("name"),
        nationalId: getInputValue("nationalId"),
        phone: getInputValue("phone"),
        job: getInputValue("job"),
        company: getInputValue("company"),
        frontImage: await fileToBase64(getFileInput("front")),
        backImage: await fileToBase64(getFileInput("back")),
        permitImage: "",
        cvImage: cvBase64
    };

    sendApiRequest(data)
    .then(function(res){
        hideLoading();
        if(res && (res.status === true || res.status === "success")){
            hideErrorBanner();
            showSuccessBanner(res.message);
            const form = document.querySelector("form");
            if (form) form.reset();
            document.querySelectorAll(".preview-image").forEach(img => img.style.display = "none");
        } else {
            const msg = (res && res.message) ? res.message : "حدث خطأ أثناء الحفظ";
            showErrorBanner(msg);
        }
    })
    .catch(function(err){
        hideLoading();
        showErrorBanner("خطأ في الاتصال بالخادم: " + err);
    });
}

async function savePermit(typeTitle = "تقديم ومعايا تصريح شركة ثانية"){
    if(!validateRegister(true, true)) return;

    showLoading();
    let cvBase64 = await fileToBase64(getFileInput("cvInput"));
    let clearanceBase64 = await fileToBase64(getFileInput("clearance"));

    const data = {
        action: "saveData",
        type: typeTitle,
        name: getInputValue("name"),
        nationalId: getInputValue("nationalId"),
        phone: getInputValue("phone"),
        job: getInputValue("job"),
        company: getInputValue("company"),
        frontImage: await fileToBase64(getFileInput("front")),
        backImage: await fileToBase64(getFileInput("back")),
        permitImage: await fileToBase64(getFileInput("permit")),
        cvImage: cvBase64,
        clearanceImage: clearanceBase64
    };

    sendApiRequest(data)
    .then(function(res){
        hideLoading();
        if(res && (res.status === true || res.status === "success")){
            hideErrorBanner();
            showSuccessBanner(res.message);
            const form = document.querySelector("form");
            if (form) form.reset();
            document.querySelectorAll(".preview-image").forEach(img => img.style.display = "none");
        } else {
            const msg = (res && res.message) ? res.message : "الرقم القومي مسجل بالفعل أو حدث خطأ!";
            showErrorBanner(msg);
        }
    })
    .catch(function(err){
        hideLoading();
        showErrorBanner("حدث خطأ: " + err);
    });
}

async function saveRenewPermit(){
    if(!validateRegister(true, false)) return;

    showLoading();
    let cvBase64 = await fileToBase64(getFileInput("cvInput"));

    const data = {
        action: "saveData",
        type: "تجديد تصريح",
        name: getInputValue("name"),
        nationalId: getInputValue("nationalId"),
        phone: getInputValue("phone"),
        job: getInputValue("job"),
        company: getInputValue("company"),
        frontImage: await fileToBase64(getFileInput("front")),
        backImage: await fileToBase64(getFileInput("back")),
        permitImage: await fileToBase64(getFileInput("permit")),
        cvImage: cvBase64
    };

    sendApiRequest(data)
    .then(function(res){
        hideLoading();
        if(res && (res.status === true || res.status === "success")){
            hideErrorBanner();
            showSuccessBanner(res.message);
            const form = document.querySelector("form");
            if (form) form.reset();
            document.querySelectorAll(".preview-image").forEach(img => img.style.display = "none");
        } else {
            const msg = (res && res.message) ? res.message : "الرقم القومي مسجل بالفعل أو حدث خطأ!";
            showErrorBanner(msg);
        }
    })
    .catch(function(err){
        hideLoading();
        showErrorBanner("حدث خطأ: " + err);
    });
}

function searchRecord(){
    const nationalId = getInputValue("searchId");

    if(!nationalId){
        if(typeof showErrorBanner === "function") showErrorBanner("أدخل الرقم القومي للبحث");
        return;
    }

    showLoading();
    const resultEl = document.getElementById("result");
    if(resultEl) resultEl.innerHTML = "";

    sendApiRequest({ action: "searchData", nationalId: nationalId })
    .then(function(res){
        hideLoading();
        if(res && res.status === "success"){
            showResult(res.data);
        } else {
            showResult(null);
        }
    })
    .catch(function(err){
        hideLoading();
        if(typeof showErrorBanner === "function") showErrorBanner("خطأ في البحث: " + err);
    });
}

function showResult(data){
    const result = document.getElementById("result");
    if(!result) return;

    if(!data){
        result.innerHTML = `<div style="text-align:center; color:red; font-weight:bold; font-size:18px; padding:15px;">❌ لا يوجد موظف مسجل بهذا الرقم القومي</div>`;
        return;
    }

    let permitHtml = "";
    const permitSrc = data.permit || data.permitImage;
    if(permitSrc){
        permitHtml = `
            <hr>
            <h4 style="margin-top:10px;">التصريح:</h4>
            <a href="${permitSrc}" target="_blank">
                <img src="${formatImageUrl(permitSrc)}" class="result-image" alt="صورة التصريح">
            </a>
        `;
    }

    let cvHtml = "";
    if(data.cv || data.cvImage){
        const cvSrc = data.cv || data.cvImage;
        cvHtml = `
            <hr>
            <h4 style="margin-top:10px;">السيرة الذاتية (CV):</h4>
            <a href="${cvSrc}" target="_blank" class="btn btn-sm btn-info" style="display:inline-block; margin-top:5px; text-decoration:none;">📄 عرض أو تحميل ملف الـ CV</a>
        `;
    }

    const regType = data.type || "";
    const statusVal = (data.permitStatus || "").replace(/[✅❌]/g, '').trim();
    const lectureVal = (data.lectureStatus || "").replace(/[✅❌]/g, '').trim();

    let finalStatus = statusVal !== "" ? statusVal : "لم يتم القبول بعد";
    let finalLecture = lectureVal !== "" ? lectureVal : "لم يحدد بعد";

    let statusHtml = "";
    if ((finalStatus.includes("تم القبول") || finalStatus.includes("مقبول")) && !finalStatus.includes("لم")) {
        statusHtml = '<span style="color: #28a745;">' + finalStatus + ' ✅</span>';
    } else {
        statusHtml = '<span style="color: #dc3545;">' + finalStatus + ' ❌</span>';
    }

    let lectureHtml = "";
    if (finalLecture.includes("محدد") && !finalLecture.includes("لم")) {
        lectureHtml = '<span style="color: #28a745;">' + finalLecture + ' ✅</span>';
    } else {
        lectureHtml = '<span style="color: #dc3545;">' + finalLecture + ' ❌</span>';
    }

    const frontSrc = data.front || data.frontImage || "";
    const backSrc = data.back || data.backImage || "";

    result.innerHTML = `
        <div class="result-card">
            <table class="table">
                <tr><td><b>نوع التسجيل</b></td><td>${regType}</td></tr>
                <tr><td><b>الاسم بالكامل</b></td><td>${data.name || "-"}</td></tr>
                <tr><td><b>الرقم القومي</b></td><td>${data.nationalId || "-"}</td></tr>
                <tr><td><b>رقم الهاتف</b></td><td>${data.phone || "-"}</td></tr>
                <tr><td><b>المهنة</b></td><td>${data.job || "-"}</td></tr>
                <tr><td><b>الشركة</b></td><td>${data.company || "-"}</td></tr>
                <tr><td><b>تاريخ التسجيل</b></td><td>${data.date || "-"}</td></tr>
            </table>

            <div style="margin: 15px 0; padding: 10px 0; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd;">
                <div style="margin-bottom: 8px;"><b>الحالة:</b> ${statusHtml}</div>
                <div><b>موعد التسليم:</b> ${lectureHtml}</div>
            </div>

            <hr>
            <h4>الوجه الأمامي:</h4>
            <a href="${frontSrc}" target="_blank">
                <img src="${formatImageUrl(frontSrc)}" class="result-image" alt="وجه البطاقة">
            </a>

            <hr>
            <h4>الوجه الخلفي:</h4>
            <a href="${backSrc}" target="_blank">
                <img src="${formatImageUrl(backSrc)}" class="result-image" alt="خلف البطاقة">
            </a>

            ${permitHtml}
            ${cvHtml}
        </div>
    `;
}

function previewImage(input, imageId){
    if(!input || !input.files || !input.files[0]) return;

    const reader = new FileReader();
    reader.onload = function(e){
        const img = document.getElementById(imageId);
        if(img){
            img.src = e.target.result;
            img.style.display = "block";
            img.style.maxWidth = "100%";
            img.style.maxHeight = "50px";
            img.style.objectFit = "contain";
            img.style.margin = "3px auto";
            img.style.borderRadius = "4px";
            img.style.border = "1px solid #0d6efd";
        }
    };
    reader.readAsDataURL(input.files[0]);
}

function previewFront(){ previewImage(document.getElementById("front"), "frontPreview"); }
function previewBack(){ previewImage(document.getElementById("back"), "backPreview"); }
function previewPermit(){ previewImage(document.getElementById("permit"), "permitPreview"); }
function previewClearance(){ previewImage(document.getElementById("clearance"), "clearancePreview"); }
function previewCv(){ 
    const cvEl = document.getElementById("cvInput") || document.getElementById("cv");
    previewImage(cvEl, "cvPreview"); 
}

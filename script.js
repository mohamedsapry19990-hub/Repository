<style>
.image-upload-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 8px !important;
    padding: 5px 0 !important;
}
.image-upload-grid > * {
    margin: 0 !important;
    padding: 5px !important;
}
.image-upload-grid label,
.image-upload-grid .form-label {
    font-size: 13px !important;
    margin-bottom: 2px !important;
}
.image-upload-grid img {
    max-width: 100% !important;
    height: auto !important;
}
</style>

<script>
// =========================================================================
// 🔗 رابط تطبيق Google Apps Script (استبدل هذا الرابط برابط الـ Web App الخاص بك)
// =========================================================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw2dMvVYPBC-C6bJNdLA0bNYqRpA-4scruM6ldlCwxscwqyBNog61e8mDYdyifzftvZVw/exec";

// =========================================================================
// 🌐 دالة عامة لإرسال البيانات إلى Google Apps Script عبر Fetch API
// =========================================================================
async function callApi(payload) {
    const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
    });
    return await response.json();
}

//======================================
// ضمان تفعيل التمرير (Scroll) وإضافة مساحة سفليّة لرؤية الأزرار دائماً
//======================================
document.addEventListener("DOMContentLoaded", function() {
    document.body.style.overflowY = "auto";
    document.body.style.paddingBottom = "100px";
    if(document.documentElement) document.documentElement.style.overflowY = "auto";

    //======================================
    // ترتيب صور الرفع في صفوف (كل اتنين جمب بعض) لصفحة تقديم تصريح شركة أخرى
    //======================================
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
            firstSection.parentElement.insertBefore(grid, firstSection);

            uploadSections.forEach(function(section) {
                grid.appendChild(section);
            });
        }
    }
});

//======================================
// Suppress default alerts completely
//======================================
window.alert = function() {
    // تم تعطيل التنبيهات المزعجة
};

//======================================
// Helper: Format Google Drive Image URL
//======================================
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

//======================================
// Convert Image / File To Base64 (Compressed & Safe)
//======================================
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

//======================================
// Loading Indicator
//======================================
function showLoading(){
    const loading = document.getElementById("loading");
    if(loading) {
        loading.style.display = "block";
        loading.style.position = "static";
        loading.style.textAlign = "center";
        loading.style.margin = "15px auto";
        loading.style.color = "#0d6efd";
        loading.style.fontSize = "16px";
        loading.style.fontWeight = "bold";
    }
}

function hideLoading(){
    const loading = document.getElementById("loading");
    if(loading) loading.style.display = "none";
}

//======================================
// Safe Helper Get Element Value / Files
//======================================
function getInputValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
}

function getFileInput(id) {
    const el = document.getElementById(id);
    return (el && el.files && el.files.length > 0) ? el.files[0] : null;
}

//======================================
// Comprehensive Validation
//======================================
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

//======================================
// Save Register
//======================================
async function save(){
    if(!validateRegister(false, false)) return;

    showLoading();

    try {
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

        const res = await callApi(data);
        hideLoading();

        if(res && (res.status === true || res.status === "success")){
            if(typeof hideErrorBanner === "function") hideErrorBanner();
            if(typeof showSuccessBanner === "function") {
                showSuccessBanner();
            } else if(typeof showSuccessModal === "function") {
                showSuccessModal();
            } else {
                alert("تم الحفظ بنجاح!");
            }
        } else {
            const msg = (res && res.message) ? res.message : "حدث خطأ أثناء الحفظ";
            if(typeof showErrorBanner === "function") showErrorBanner(msg);
        }
    } catch (err) {
        hideLoading();
        if(typeof showErrorBanner === "function") showErrorBanner("خطأ: " + err);
    }
}

//======================================
// Save Permit (تقديم ومعايا تصريح شركة ثانية)
//======================================
async function savePermit(typeTitle = "تقديم ومعايا تصريح شركة ثانية"){
    if(!validateRegister(true, true)) return;

    showLoading();

    try {
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

        const res = await callApi(data);
        hideLoading();

        if(res && (res.status === true || res.status === "success")){
            if(typeof hideErrorBanner === "function") hideErrorBanner();
            if(typeof showSuccessBanner === "function") {
                showSuccessBanner();
            } else if(typeof showSuccessModal === "function") {
                showSuccessModal();
            }
        } else {
            const msg = (res && res.message) ? res.message : "الرقم القومي مسجل بالفعل أو حدث خطأ!";
            if(typeof showErrorBanner === "function") showErrorBanner(msg);
        }
    } catch (err) {
        hideLoading();
        if(typeof showErrorBanner === "function") showErrorBanner("حدث خطأ: " + err);
    }
}

//======================================
// Save Renew Permit (تجديد التصاريح)
//======================================
async function saveRenewPermit(){
    if(!validateRegister(true, false)) return;

    showLoading();

    try {
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

        const res = await callApi(data);
        hideLoading();

        if(res && (res.status === true || res.status === "success")){
            if(typeof hideErrorBanner === "function") hideErrorBanner();
            if(typeof showSuccessBanner === "function") {
                showSuccessBanner();
            } else if(typeof showSuccessModal === "function") {
                showSuccessModal();
            }
        } else {
            const msg = (res && res.message) ? res.message : "الرقم القومي مسجل بالفعل أو حدث خطأ!";
            if(typeof showErrorBanner === "function") showErrorBanner(msg);
        }
    } catch (err) {
        hideLoading();
        if(typeof showErrorBanner === "function") showErrorBanner("حدث خطأ: " + err);
    }
}

//======================================
// Search Employee
//======================================
async function searchRecord(){
    const nationalId = getInputValue("searchId");

    if(!nationalId){
        if(typeof showErrorBanner === "function") showErrorBanner("أدخل الرقم القومي للبحث");
        return;
    }

    showLoading();
    const resultEl = document.getElementById("result");
    if(resultEl) resultEl.innerHTML = "";

    try {
        const data = await callApi({ action: "searchData", nationalId: nationalId });
        hideLoading();
        showResult(data);
    } catch (err) {
        hideLoading();
        if(typeof showErrorBanner === "function") showErrorBanner("خطأ في البحث: " + err);
    }
}

//======================================
// Show Search Result
//======================================
function showResult(data){
    const result = document.getElementById("result");
    if(!result) return;

    if(!data || data.error){
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
                <div><b>موعد الاستلام:</b> ${lectureHtml}</div>
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

//======================================
// Clean & Balanced Image Previews
//======================================
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
</script>

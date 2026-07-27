// =========================================================================
// 🔗 رابط تطبيق Google Apps Script
// =========================================================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwg6kHBfYivLAuKOcn9bCw4LhlaHNfd00qyiIAPlpQpdPlQcAEMd6QtZx4b9pZ8XRjaeg/exec";

// =========================================================================
// 🌐 دالة إرسال البيانات عبر Fetch API
// =========================================================================
async function callApi(payload) {
    try {
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
        });
        const resJson = await response.json();
        return resJson;
    } catch (err) {
        console.error("API Call Error:", err);
        return { status: false, message: "تعذر الاتصال بالسيرفر: " + err.message };
    }
}

// دالة جسر لضمان توافق أي نداء قديم (مثل fetchData) مع الدالة الحالية
async function fetchData(payload) {
    return await callApi(payload);
}

// =========================================================================
// 🔔 نظام التنبيهات التلقائي (Fallback Toast System)
// =========================================================================
function showCustomNotification(message, isError = false) {
    let existing = document.getElementById("system-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "system-toast";
    toast.className = `system-toast-banner ${isError ? 'system-toast-error' : 'system-toast-success'}`;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast) toast.remove();
    }, 4000);
}

function triggerError(msg) {
    if (typeof showErrorBanner === "function") showErrorBanner(msg);
    else showCustomNotification(msg, true);
}

function triggerSuccess(msg = "تمت العملية بنجاح! ✅") {
    if (typeof showSuccessBanner === "function") showSuccessBanner(msg);
    else if (typeof showSuccessModal === "function") showSuccessModal(msg);
    else showCustomNotification(msg, false);
}

//======================================
// إدارة حالة التحميل وتعطيل الأزرار لمنع التكرار
//======================================
function setUIState(isLoading) {
    const loadingEl = document.getElementById("loading");
    const buttons = document.querySelectorAll("button, input[type='submit'], input[type='button']");

    buttons.forEach(btn => btn.disabled = isLoading);

    if (loadingEl) {
        loadingEl.style.display = isLoading ? "block" : "none";
        if (isLoading) {
            loadingEl.style.position = "static";
            loadingEl.style.textAlign = "center";
            loadingEl.style.margin = "15px auto";
            loadingEl.style.color = "#0d6efd";
            loadingEl.style.fontSize = "16px";
            loadingEl.style.fontWeight = "bold";
        }
    }
}

function showLoading() { setUIState(true); }
function hideLoading() { setUIState(false); }

//======================================
// إعداد عناصر الصفحة فور التحميل
//======================================
document.addEventListener("DOMContentLoaded", function() {
    document.body.style.overflowY = "auto";
    document.body.style.paddingBottom = "100px";
    if (document.documentElement) document.documentElement.style.overflowY = "auto";

    // حقن ستايلات التنبيهات والشبكة تلقائياً
    if (!document.getElementById("custom-dynamic-styles")) {
        const style = document.createElement("style");
        style.id = "custom-dynamic-styles";
        style.innerHTML = `
            .image-upload-grid {
                display: grid !important;
                grid-template-columns: 1fr 1fr !important;
                gap: 8px !important;
                padding: 5px 0 !important;
            }
            .image-upload-grid > * { margin: 0 !important; padding: 5px !important; }
            .image-upload-grid label, .image-upload-grid .form-label { font-size: 13px !important; margin-bottom: 2px !important; }
            .image-upload-grid img { max-width: 100% !important; height: auto !important; }
            .system-toast-banner {
                position: fixed; top: 15px; left: 50%; transform: translateX(-50%);
                z-index: 999999; padding: 12px 24px; border-radius: 8px;
                font-weight: bold; font-size: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.3s ease; text-align: center; max-width: 90%;
            }
            .system-toast-success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
            .system-toast-error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        `;
        document.head.appendChild(style);
    }

    // ترتيب خانات الصور في شبكة من عمودين
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
            uploadSections.forEach(sec => grid.appendChild(sec));
        }
    }
});

// إلغاء الـ Alert التقليدي
window.alert = function() {};

//======================================
// تنسيق رابط صورة Google Drive
//======================================
function formatImageUrl(url) {
    if (!url) return '';
    let fileId = '';
    
    if (url.indexOf('id=') !== -1) {
        let match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (match && match[1]) fileId = match[1];
    } else if (url.indexOf('/d/') !== -1) {
        let match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) fileId = match[1];
    }

    return fileId ? 'https://lh3.googleusercontent.com/d/' + fileId : url;
}

//======================================
// ضغط وتعديل حجم الصور بسرعة فائقة
//======================================
function fileToBase64(file) {
    return new Promise((resolve) => {
        if (!file) return resolve("");

        if (!file.type || !file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => resolve("");
            reader.readAsDataURL(file);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const maxDim = 1000;

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
                resolve(canvas.toDataURL('image/jpeg', 0.70));
            };
            img.onerror = () => resolve(e.target.result);
            img.src = e.target.result;
        };
        reader.onerror = () => resolve("");
        reader.readAsDataURL(file);
    });
}

//======================================
// أدوات المساعدة لقراءة مدخلات النماذج
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
// دالة التحقق الشامل من المدخلات
//======================================
function validateRegister(requirePermit = false, requireClearance = false) {
    if (typeof hideErrorBanner === "function") hideErrorBanner();

    if (!getInputValue("name")) {
        triggerError("أدخل الاسم بالكامل");
        return false;
    }

    const nationalId = getInputValue("nationalId");
    if (nationalId.length !== 14 || isNaN(nationalId)) {
        triggerError("الرقم القومي يجب أن يتكون من 14 رقم بالضبط");
        return false;
    }

    if (!getInputValue("phone")) {
        triggerError("أدخل رقم الهاتف الصحيح");
        return false;
    }
    
    const jobVal = getInputValue("job");
    if (!jobVal) {
        triggerError("أدخل المهنة من القائمة");
        return false;
    }

    const supervisorsList = ['مشرف شدة', 'مشرف لحام', 'مشرف عام', 'مشرف إنشائي'];
    if (supervisorsList.includes(jobVal)) {
        const cvFile = getFileInput("cvInput") || getFileInput("cv");
        if (!cvFile) {
            triggerError("رفع ملف أو صورة الـ CV إلزامي للمشرفين");
            return false;
        }
    }

    if (!getFileInput("front")) { triggerError("اختر صورة البطاقة (الوجه الأمامي)"); return false; }
    if (!getFileInput("back")) { triggerError("اختر صورة البطاقة (الوجه الخلفي)"); return false; }
    if (requirePermit && !getFileInput("permit")) { triggerError("اختر صورة التصريح"); return false; }
    if (requireClearance && !getFileInput("clearance")) { triggerError("رفع صورة الممانعة إلزامي جداً للقبول"); return false; }

    return true;
}

//======================================
// 1. تسجيل موظف جديد
//======================================
async function save(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!validateRegister(false, false)) return;

    showLoading();

    try {
        const [frontImg, backImg, cvImg] = await Promise.all([
            fileToBase64(getFileInput("front")),
            fileToBase64(getFileInput("back")),
            fileToBase64(getFileInput("cvInput") || getFileInput("cv"))
        ]);

        const data = {
            action: "saveData",
            type: "تسجيل موظف جديد",
            name: getInputValue("name"),
            nationalId: getInputValue("nationalId"),
            phone: getInputValue("phone"),
            job: getInputValue("job"),
            company: getInputValue("company"),
            frontImage: frontImg,
            backImage: backImg,
            permitImage: "",
            cvImage: cvImg
        };

        const res = await callApi(data);
        hideLoading();

        if (res && (res.status === true || res.status === "success")) {
            triggerSuccess("تم حفظ بيانات الموظف بنجاح!");
        } else {
            triggerError(res?.message || "حدث خطأ أثناء الحفظ أو الرقم القومي مسجل من قبل");
        }
    } catch (err) {
        hideLoading();
        triggerError("حدث خطأ في الاتصال: " + err);
    }
}

async function saveData(e) {
    return await save(e);
}

//======================================
// 2. تقديم تصريح شركة أخرى
//======================================
async function savePermit(typeTitle = "تقديم ومعايا تصريح شركة ثانية") {
    if (!validateRegister(true, true)) return;

    showLoading();

    try {
        const [frontImg, backImg, permitImg, clearanceImg, cvImg] = await Promise.all([
            fileToBase64(getFileInput("front")),
            fileToBase64(getFileInput("back")),
            fileToBase64(getFileInput("permit")),
            fileToBase64(getFileInput("clearance")),
            fileToBase64(getFileInput("cvInput") || getFileInput("cv"))
        ]);

        const data = {
            action: "saveData",
            type: typeTitle,
            name: getInputValue("name"),
            nationalId: getInputValue("nationalId"),
            phone: getInputValue("phone"),
            job: getInputValue("job"),
            company: getInputValue("company"),
            frontImage: frontImg,
            backImage: backImg,
            permitImage: permitImg,
            clearanceImage: clearanceImg,
            cvImage: cvImg
        };

        const res = await callApi(data);
        hideLoading();

        if (res && (res.status === true || res.status === "success")) {
            triggerSuccess("تم تقديم بيانات التصريح بنجاح!");
        } else {
            triggerError(res?.message || "الرقم القومي مسجل بالفعل أو حدث خطأ!");
        }
    } catch (err) {
        hideLoading();
        triggerError("حدث خطأ في الاتصال: " + err);
    }
}

//======================================
// 3. تجديد التصاريح
//======================================
async function saveRenewPermit() {
    if (!validateRegister(true, false)) return;

    showLoading();

    try {
        const [frontImg, backImg, permitImg, cvImg] = await Promise.all([
            fileToBase64(getFileInput("front")),
            fileToBase64(getFileInput("back")),
            fileToBase64(getFileInput("permit")),
            fileToBase64(getFileInput("cvInput") || getFileInput("cv"))
        ]);

        const data = {
            action: "saveData",
            type: "تجديد تصريح",
            name: getInputValue("name"),
            nationalId: getInputValue("nationalId"),
            phone: getInputValue("phone"),
            job: getInputValue("job"),
            company: getInputValue("company"),
            frontImage: frontImg,
            backImage: backImg,
            permitImage: permitImg,
            cvImage: cvImg
        };

        const res = await callApi(data);
        hideLoading();

        if (res && (res.status === true || res.status === "success")) {
            triggerSuccess("تم طلب تجديد التصريح بنجاح!");
        } else {
            triggerError(res?.message || "حدث خطأ أثناء التجديد!");
        }
    } catch (err) {
        hideLoading();
        triggerError("حدث خطأ في الاتصال: " + err);
    }
}

//======================================
// 4. البحث عن موظف
//======================================
async function searchRecord() {
    const nationalId = getInputValue("searchId");

    if (!nationalId) {
        triggerError("أدخل الرقم القومي للبحث");
        return;
    }

    showLoading();
    const resultEl = document.getElementById("result");
    if (resultEl) resultEl.innerHTML = "";

    try {
        const response = await callApi({ action: "searchData", nationalId: nationalId });
        hideLoading();
        showResult(response);
    } catch (err) {
        hideLoading();
        triggerError("خطأ أثناء البحث: " + err);
    }
}

//======================================
// عرض نتائج البحث (معالجة دقيقة للـ Payload)
//======================================
function showResult(response) {
    const result = document.getElementById("result");
    if (!result) return;

    if (!response || response.status === false || !response.data) {
        const msg = response?.message || "❌ لا يوجد موظف مسجل بهذا الرقم القومي";
        result.innerHTML = `<div style="text-align:center; color:#dc3545; font-weight:bold; font-size:18px; padding:20px; border:1px solid #f5c6cb; background:#f8d7da; border-radius:8px;">${msg}</div>`;
        return;
    }

    // استخراج الكائن الداخلي بحرفية
    const data = response.data;

    let permitHtml = "";
    const permitSrc = data.permit || data.permitImage;
    if (permitSrc) {
        permitHtml = `
            <hr>
            <h4 style="margin-top:10px;">التصريح:</h4>
            <a href="${permitSrc}" target="_blank">
                <img src="${formatImageUrl(permitSrc)}" class="result-image" style="max-width:100%; border-radius:6px;" alt="صورة التصريح">
            </a>
        `;
    }

    let cvHtml = "";
    const cvSrc = data.cv || data.cvImage;
    if (cvSrc) {
        cvHtml = `
            <hr>
            <h4 style="margin-top:10px;">السيرة الذاتية (CV):</h4>
            <a href="${cvSrc}" target="_blank" class="btn btn-sm btn-info" style="display:inline-block; margin-top:5px; text-decoration:none; padding:8px 12px; background:#17a2b8; color:#fff; border-radius:4px;">📄 عرض أو تحميل ملف الـ CV</a>
        `;
    }

    const regType = data.type || "";
    const statusVal = (data.permitStatus || "").replace(/[✅❌]/g, '').trim();
    const lectureVal = (data.lectureStatus || "").replace(/[✅❌]/g, '').trim();

    let finalStatus = statusVal !== "" ? statusVal : "لم يتم القبول بعد";
    let finalLecture = lectureVal !== "" ? lectureVal : "لم يحدد بعد";

    let statusHtml = ((finalStatus.includes("تم القبول") || finalStatus.includes("مقبول")) && !finalStatus.includes("لم"))
        ? `<span style="color: #28a745; font-weight:bold;">${finalStatus} ✅</span>`
        : `<span style="color: #dc3545; font-weight:bold;">${finalStatus} ❌</span>`;

    let lectureHtml = (finalLecture.includes("محدد") && !finalLecture.includes("لم"))
        ? `<span style="color: #28a745; font-weight:bold;">${finalLecture} ✅</span>`
        : `<span style="color: #dc3545; font-weight:bold;">${finalLecture} ❌</span>`;

    const frontSrc = data.front || data.frontImage || "";
    const backSrc = data.back || data.backImage || "";

    result.innerHTML = `
        <div class="result-card" style="background:#fff; padding:15px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            <table class="table" style="width:100%; text-align:right;">
                <tr><td><b>نوع التسجيل:</b></td><td>${regType}</td></tr>
                <tr><td><b>الاسم بالكامل:</b></td><td>${data.name || "-"}</td></tr>
                <tr><td><b>الرقم القومي:</b></td><td>${data.nationalId || "-"}</td></tr>
                <tr><td><b>رقم الهاتف:</b></td><td>${data.phone || "-"}</td></tr>
                <tr><td><b>المهنة:</b></td><td>${data.job || "-"}</td></tr>
                <tr><td><b>الشركة:</b></td><td>${data.company || "-"}</td></tr>
                <tr><td><b>تاريخ التسجيل:</b></td><td>${data.date || "-"}</td></tr>
            </table>

            <div style="margin: 15px 0; padding: 10px; background:#f8f9fa; border-radius:6px;">
                <div style="margin-bottom: 8px;"><b>الحالة:</b> ${statusHtml}</div>
                <div><b>موعد الاستلام:</b> ${lectureHtml}</div>
            </div>

            ${frontSrc ? `<hr><h4>الوجه الأمامي:</h4><a href="${frontSrc}" target="_blank"><img src="${formatImageUrl(frontSrc)}" class="result-image" style="max-width:100%; border-radius:6px;" alt="وجه البطاقة"></a>` : ''}
            ${backSrc ? `<hr><h4>الوجه الخلفي:</h4><a href="${backSrc}" target="_blank"><img src="${formatImageUrl(backSrc)}" class="result-image" style="max-width:100%; border-radius:6px;" alt="خلف البطاقة"></a>` : ''}

            ${permitHtml}
            ${cvHtml}
        </div>
    `;
}

//======================================
// معاينة الصور المبسطة
//======================================
function previewImage(input, imageId) {
    if (!input || !input.files || !input.files[0]) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.getElementById(imageId);
        if (img) {
            img.src = e.target.result;
            img.style.display = "block";
            img.style.maxWidth = "100%";
            img.style.maxHeight = "60px";
            img.style.objectFit = "contain";
            img.style.margin = "5px auto";
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

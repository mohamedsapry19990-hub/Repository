/* ============================================================================
   GPS COMPANY - Shared API & Form Script
   ============================================================================ */

const API_URL = "https://script.google.com/macros/s/AKfycbylz_Dk9pDVMxXWicoZlHCrUrDActFqHTD9cgGfcOuv4Xzk0YLyq4iXfBoyzLZUPX3V3A/exec";

function checkSupervisor(selectId, cvGroupId) {
    const jobVal = document.getElementById(selectId).value;
    const supervisors = ['مشرف شدة', 'مشرف لحام', 'مشرف عام', 'مشرف إنشائي'];
    const cvGroup = document.getElementById(cvGroupId);
    if (cvGroup) {
        cvGroup.style.display = supervisors.includes(jobVal) ? 'block' : 'none';
    }
}

function previewImage(input, imageId) {
    if (!input || !input.files || !input.files[0]) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.getElementById(imageId);
        if (img) {
            img.src = e.target.result;
            img.style.display = 'block';
        }
    };
    reader.readAsDataURL(input.files[0]);
}

function fileToBase64(file) {
    return new Promise(function(resolve, reject) {
        if (!file) { resolve(""); return; }
        const reader = new FileReader();
        reader.onload = function(e) {
            if (file.type && file.type.startsWith('image/')) {
                const img = new Image();
                img.onload = function() {
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
                    resolve(canvas.toDataURL('image/jpeg', 0.75));
                };
                img.onerror = function() { resolve(e.target.result); };
                img.src = e.target.result;
            } else {
                resolve(e.target.result);
            }
        };
        reader.onerror = function() { reject("خطأ في قراءة الملف"); };
        reader.readAsDataURL(file);
    });
}

function showLoading() {
    const el = document.getElementById('loading');
    if (el) el.style.display = 'block';
}

function hideLoading() {
    const el = document.getElementById('loading');
    if (el) el.style.display = 'none';
}

function showError(msg) {
    const el = document.getElementById('errorBanner');
    if (el) {
        el.innerText = msg;
        el.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function showSuccess(msg) {
    const el = document.getElementById('successBanner');
    if (el) {
        el.innerText = msg;
        el.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function hideBanners() {
    const err = document.getElementById('errorBanner');
    const succ = document.getElementById('successBanner');
    if (err) err.style.display = 'none';
    if (succ) succ.style.display = 'none';
}

function getInputValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
}

function getFileInput(id) {
    const el = document.getElementById(id);
    return (el && el.files && el.files.length > 0) ? el.files[0] : null;
}

async function submitFormData(event, typeTitle) {
    event.preventDefault();
    hideBanners();

    const name = getInputValue("name");
    const nationalId = getInputValue("nationalId");
    const phone = getInputValue("phone");
    const job = getInputValue("job");
    const company = getInputValue("company") || "GPS COMPANY";

    if (!name) { showError("أدخل الاسم بالكامل"); return; }
    if (nationalId.length !== 14) { showError("الرقم القومي يجب أن يتكون من 14 رقم بالضبط"); return; }
    if (!phone) { showError("أدخل رقم الهاتف"); return; }
    if (!job) { showError("أدخل المهنة من القائمة"); return; }

    const supervisorsList = ['مشرف شدة', 'مشرف لحام', 'مشرف عام', 'مشرف إنشائي'];
    if (supervisorsList.includes(job) && !getFileInput("cvInput")) {
        showError("رفع ملف أو صورة السيرة الذاتية (CV) إلزامي للمشرفين");
        return;
    }

    if (!getFileInput("front")) { showError("اختر صورة البطاقة (الوجه الأمامي)"); return; }
    if (!getFileInput("back")) { showError("اختر صورة البطاقة (الوجه الخلفي)"); return; }

    if (typeTitle.includes("تصريح شركة") && !getFileInput("permit")) {
        showError("اختر صورة التصريح");
        return;
    }
    if (typeTitle.includes("تصريح شركة") && !getFileInput("clearance")) {
        showError("رفع صورة الممانعة إلزامي جداً للقبول");
        return;
    }
    if (typeTitle.includes("تجديد") && !getFileInput("permit")) {
        showError("اختر صورة التصريح السابق المنتهي");
        return;
    }

    showLoading();

    try {
        const payload = {
            action: "saveData",
            type: typeTitle,
            name: name,
            nationalId: nationalId,
            phone: phone,
            job: job,
            company: company,
            frontImage: await fileToBase64(getFileInput("front")),
            backImage: await fileToBase64(getFileInput("back")),
            permitImage: await fileToBase64(getFileInput("permit")),
            cvImage: await fileToBase64(getFileInput("cvInput")),
            clearanceImage: await fileToBase64(getFileInput("clearance"))
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });

        const res = await response.json();
        hideLoading();

        if (res && (res.status === true || res.status === "success")) {
            showSuccess("✅ " + (res.message || "تم حفظ البيانات بنجاح!"));
            event.target.reset();
            document.querySelectorAll('.preview-img').forEach(img => img.style.display = 'none');
        } else {
            showError("❌ " + (res && res.message ? res.message : "حدث خطأ أثناء الحفظ"));
        }

    } catch (err) {
        hideLoading();
        showError("حدث خطأ في الاتصال بالخادم: " + err.toString());
    }
}

async function searchRecord() {
    hideBanners();
    const searchId = getInputValue("searchId");
    const resultEl = document.getElementById("result");
    if (resultEl) resultEl.innerHTML = "";

    if (!searchId || searchId.length !== 14) {
        showError("أدخل رقم قومي صحيح مكون من 14 رقم للبحث");
        return;
    }

    showLoading();

    try {
        const payload = {
            action: "searchData",
            nationalId: searchId
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });

        const res = await response.json();
        hideLoading();

        if (res && res.status === "success" && res.data) {
            showResult(res.data);
        } else {
            if (resultEl) {
                resultEl.innerHTML = `<div class="result-card" style="text-align:center; color:red; font-weight:bold;">❌ ${res.message || 'لا يوجد موظف مسجل بهذا الرقم القومي'}</div>`;
            }
        }

    } catch (err) {
        hideLoading();
        showError("خطأ في البحث: " + err.toString());
    }
}

function formatImageUrl(url) {
    if (!url) return '';
    let fileId = '';
    if (url.indexOf('id=') !== -1) {
        const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (match && match[1]) fileId = match[1];
    } else if (url.indexOf('/d/') !== -1) {
        const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) fileId = match[1];
    }
    return fileId ? 'https://lh3.googleusercontent.com/d/' + fileId : url;
}

function showResult(data) {
    const result = document.getElementById("result");
    if (!result) return;

    let permitHtml = "";
    const permitSrc = data.permit || data.permitImage;
    if (permitSrc) {
        permitHtml = `
            <hr style="margin:15px 0;">
            <h4>التصريح:</h4>
            <a href="${permitSrc}" target="_blank">
                <img src="${formatImageUrl(permitSrc)}" class="result-image" alt="صورة التصريح">
            </a>
        `;
    }

    let cvHtml = "";
    if (data.cv || data.cvImage) {
        const cvSrc = data.cv || data.cvImage;
        cvHtml = `
            <hr style="margin:15px 0;">
            <h4>السيرة الذاتية (CV):</h4>
            <a href="${cvSrc}" target="_blank" class="btn-action btn-search" style="display:inline-flex; width:auto; padding:8px 20px; font-size:14px; text-decoration:none; margin-top:8px;">📄 عرض أو تحميل ملف الـ CV</a>
        `;
    }

    const regType = data.type || "";
    const statusVal = (data.permitStatus || "").replace(/[✅❌]/g, '').trim();
    const lectureVal = (data.lectureStatus || "").replace(/[✅❌]/g, '').trim();

    let finalStatus = statusVal !== "" ? statusVal : "لم يتم القبول بعد";
    let finalLecture = lectureVal !== "" ? lectureVal : "لم يحدد بعد";

    let statusHtml = (finalStatus.includes("تم القبول") || finalStatus.includes("مقبول")) && !finalStatus.includes("لم")
        ? `<span style="color: #28a745; font-weight:bold;">${finalStatus} ✅</span>`
        : `<span style="color: #dc3545; font-weight:bold;">${finalStatus} ❌</span>`;

    let lectureHtml = finalLecture.includes("محدد") && !finalLecture.includes("لم")
        ? `<span style="color: #28a745; font-weight:bold;">${finalLecture} ✅</span>`
        : `<span style="color: #dc3545; font-weight:bold;">${finalLecture} ❌</span>`;

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

            <h4 style="margin-top:10px;">الوجه الأمامي للبطاقة:</h4>
            <a href="${frontSrc}" target="_blank">
                <img src="${formatImageUrl(frontSrc)}" class="result-image" alt="وجه البطاقة">
            </a>

            <h4 style="margin-top:10px;">الوجه الخلفي للبطاقة:</h4>
            <a href="${backSrc}" target="_blank">
                <img src="${formatImageUrl(backSrc)}" class="result-image" alt="خلف البطاقة">
            </a>

            ${permitHtml}
            ${cvHtml}
        </div>
    `;
}

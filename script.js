<style>

/* ===========================
    القواعد المشتركة لكل الصفحات
=========================== */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Tahoma, Arial, sans-serif;
}

body {
    background: #f5f7fa;
    direction: rtl;
    color: #333;
}

.container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 40px 15px;
}

.card {
    width: 700px;
    max-width: 100%;
    background: #fff;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, .15);
}

.title {
    text-align: center;
    color: #0d6efd;
    margin-bottom: 10px;
}

.subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 25px;
}

.form-group {
    margin-bottom: 18px;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
}

input[type=text] {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 15px;
}

input[type=text]:focus {
    border-color: #0d6efd;
    outline: none;
}

input[type=file] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

button {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
    transition: .3s;
}

.btn-success {
    background: #198754;
    color: #fff;
}

.btn-success:hover {
    background: #157347;
}

.btn-primary {
    background: #0d6efd;
    color: #fff;
}

.btn-primary:hover {
    background: #0b5ed7;
}

.btn-warning {
    background: #ffc107;
    color: #000;
}

.btn-warning:hover {
    background: #e0a800;
}

.btn-secondary {
    background: #6c757d;
    color: #fff;
}

.btn-secondary:hover {
    background: #565e64;
}

.menu button {
    margin-bottom: 15px;
}

.preview-image {
    width: 220px;
    display: block;
    margin: 15px auto;
    border: 2px solid #ddd;
    border-radius: 10px;
}

.result-image {
    width: 280px;
    display: block;
    margin: 15px auto;
    border: 2px solid #ddd;
    border-radius: 10px;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.table td {
    border: 1px solid #ddd;
    padding: 10px;
}

.table tr:nth-child(even) {
    background: #f8f8f8;
}

.result-card {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 10px;
}

#loading {
    display: none;
    text-align: center;
    margin-top: 20px;
    font-size: 18px;
    color: #0d6efd;
    font-weight: bold;
}

.footer {
    text-align: center;
    color: #888;
    margin-top: 20px;
    font-size: 14px;
}

/* ===========================
   الصفحة الرئيسية فقط
   لا يؤثر على باقي الصفحات
=========================== */

body.home-page {
    min-height: 100vh;
    min-height: 100dvh;
    overflow-x: hidden;
    color: #10275a;
    background:
        linear-gradient(rgba(2, 20, 70, .40), rgba(2, 20, 70, .68)),
        url("https://images.unsplash.com/photo-1614279629245-d7a138f035f0?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
        center center / cover no-repeat;
}

body.home-page::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: .28;
    background:
        radial-gradient(circle at 10% 75%, #69d7ff 0 2px, transparent 3px),
        radial-gradient(circle at 90% 23%, #69d7ff 0 2px, transparent 3px);
    background-size: 145px 165px, 190px 220px;
}

.home-page .container {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    min-height: 100dvh;
    align-items: center;
    padding: 28px 16px 22px;
}

.home-shell {
    width: min(100%, 700px);
}

.home-hero {
    padding: 5px 12px 26px;
    text-align: center;
    color: #fff;
}

.hero-logo,
.welcome-brand {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.logo-symbol,
.welcome-logo,
.footer-logo {
    display: grid;
    place-items: center;
    color: #fff;
    font-family: Arial, sans-serif;
    font-weight: 900;
    line-height: 1;
    background: linear-gradient(135deg, #129fff, #0056d9 55%, #02bf9c);
    box-shadow: 0 8px 22px rgba(3, 126, 232, .30);
}

.logo-symbol {
    width: 68px;
    height: 68px;
    margin-bottom: 7px;
    border-radius: 23px 12px 23px 12px;
    font-size: 42px;
    transform: rotate(-8deg);
}

.hero-logo strong {
    font: 800 31px Arial, sans-serif;
    letter-spacing: 2px;
}

.hero-logo small {
    margin-top: 3px;
    color: #24d5ff;
    font: 800 13px Arial, sans-serif;
    letter-spacing: 4px;
}

.home-page .title {
    margin: 25px 0 9px;
    color: #fff;
    font-size: clamp(25px, 6.6vw, 43px);
    line-height: 1.35;
    text-shadow: 0 3px 14px rgba(0, 21, 72, .24);
}

.hero-description {
    color: #deecff;
    font-size: clamp(15px, 3.8vw, 21px);
    line-height: 1.7;
}

.hero-accent {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    margin-top: 17px;
}

.hero-accent span {
    width: 48px;
    height: 5px;
    border-radius: 50px;
    background: linear-gradient(90deg, #00c5d9, #1664fb);
}

.hero-accent i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #1468ff;
}

.home-page .card {
    width: 100%;
    padding: 28px 16px 18px;
    border: 1px solid rgba(255, 255, 255, .78);
    border-radius: 29px;
    background: linear-gradient(135deg, rgba(255, 255, 255, .96), rgba(235, 244, 255, .86));
    box-shadow: 0 18px 35px rgba(0, 16, 62, .34);
}

.welcome-logo {
    width: 56px;
    height: 56px;
    margin-bottom: 13px;
    border-radius: 18px 9px 18px 9px;
    font-size: 33px;
    transform: rotate(-8deg);
}

.welcome-brand p {
    margin-bottom: 3px;
    color: #354d80;
    font-size: 18px;
    font-weight: 700;
}

.welcome-brand h2 {
    margin: 0;
    font: 800 clamp(26px, 7vw, 38px) Arial, sans-serif;
    background: linear-gradient(90deg, #1554df, #00a9c3);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.home-page .subtitle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 11px;
    margin: 13px 0 20px;
    color: #2e477b;
    font-size: 18px;
    font-weight: 700;
}

.home-page .subtitle::before,
.home-page .subtitle::after {
    content: "";
    width: 39px;
    height: 1px;
    background: #91abe0;
}

.home-page .menu {
    display: grid;
    gap: 12px;
}

.home-page .menu .menu-item {
    display: grid;
    grid-template-columns: 72px 1fr 42px;
    align-items: center;
    gap: 10px;
    min-height: 103px;
    width: 100%;
    margin: 0;
    padding: 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, .9);
    border-radius: 23px;
    color: #183361;
    text-align: right;
    background: linear-gradient(120deg, rgba(255,255,255,.98), rgba(230,240,255,.88));
    box-shadow: 0 10px 22px rgba(30, 74, 142, .10);
}

.home-page .menu .menu-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 13px 26px rgba(18, 69, 147, .20);
}

.home-page .menu .menu-item:active {
    transform: scale(.985);
}

.service-icon {
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    border-radius: 19px;
    color: #fff;
    font-family: Arial, sans-serif;
    font-size: 48px;
    font-weight: bold;
    line-height: 1;
    box-shadow: 0 9px 16px rgba(6, 70, 175, .25);
}

.service-copy {
    min-width: 0;
}

.service-copy strong,
.service-copy small {
    display: block;
}

.service-copy strong {
    margin-bottom: 7px;
    font-size: clamp(19px, 5vw, 26px);
    line-height: 1.2;
}

.service-copy small {
    color: #344d7b;
    font-size: clamp(12px, 3.25vw, 15px);
    line-height: 1.45;
}

.service-arrow {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #fff;
    color: #185ce4;
    box-shadow: 0 5px 12px rgba(25, 69, 141, .17);
    font-family: Arial, sans-serif;
    font-size: 39px;
    line-height: 1;
}

.home-page .btn-success .service-icon {
    background: linear-gradient(135deg, #10c66a, #00984a);
}

.home-page .btn-success .service-copy strong,
.home-page .btn-success .service-arrow {
    color: #009b4d;
}

.home-page .btn-primary .service-icon {
    background: linear-gradient(135deg, #2185ff, #0048df);
}

.home-page .btn-primary .service-copy strong {
    color: #1158e4;
}

.home-page .btn-warning .service-icon {
    background: linear-gradient(135deg, #ffc21a, #ff8700);
}

.home-page .btn-warning .service-copy strong,
.home-page .btn-warning .service-arrow {
    color: #f08b00;
}

.home-page .btn-info .service-icon {
    background: linear-gradient(135deg, #506a9d, #112754);
}

.home-page .btn-info .service-copy strong,
.home-page .btn-info .service-arrow {
    color: #2c477d;
}

.home-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-top: 22px;
    padding: 18px 7px 0;
    border-top: 1px solid rgba(111, 190, 255, .25);
    color: #fff;
}

.footer-brand {
    display: flex;
    align-items: center;
    gap: 10px;
}

.footer-logo {
    width: 43px;
    height: 43px;
    border-radius: 14px 7px 14px 7px;
    font-size: 25px;
}

.footer-brand strong,
.footer-brand small {
    display: block;
}

.footer-brand strong {
    font: 700 15px Arial, sans-serif;
}

.footer-brand small {
    margin-top: 4px;
    color: #36d7f3;
    font-size: 11px;
}

.home-footer p {
    margin: 0;
    font-size: 12px;
    line-height: 1.8;
    text-align: left;
}

@media (max-width: 768px) {
    .card {
        width: 100%;
        padding: 20px;
    }

    button {
        font-size: 15px;
    }

    .preview-image,
    .result-image {
        width: 100%;
    }
}

@media (max-width: 390px) {
    .home-page .container {
        padding-right: 11px;
        padding-left: 11px;
    }

    .home-page .card {
        padding: 24px 11px 14px;
        border-radius: 25px;
    }

    .home-page .menu .menu-item {
        grid-template-columns: 61px 1fr 34px;
        min-height: 91px;
        gap: 7px;
        padding: 10px;
        border-radius: 19px;
    }

    .service-icon {
        width: 61px;
        height: 61px;
        border-radius: 17px;
        font-size: 42px;
    }

    .service-arrow {
        width: 33px;
        height: 33px;
        font-size: 34px;
    }

    .home-footer {
        gap: 10px;
    }
}

/* =========================================
   صفحة تسجيل موظف جديد فقط
========================================= */

body.register-page {
    min-height: 100vh;
    min-height: 100dvh;
    overflow-x: hidden;
    background:
        linear-gradient(rgba(2, 14, 55, .46), rgba(2, 14, 55, .72)),
        url("https://drive.google.com/thumbnail?id=1J8L55XgT49KP5beqo7jLtJAoBM3Y6TzQ&sz=w1600")
        center center / cover no-repeat;
    color: #17356d;
}

body.register-page::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
        radial-gradient(circle at 8% 24%, rgba(38, 186, 255, .9) 0 2px, transparent 3px),
        radial-gradient(circle at 92% 35%, rgba(38, 186, 255, .9) 0 2px, transparent 3px),
        radial-gradient(circle at 18% 80%, rgba(38, 186, 255, .8) 0 2px, transparent 3px),
        radial-gradient(circle at 84% 75%, rgba(38, 186, 255, .8) 0 2px, transparent 3px);
    background-size: 170px 210px, 220px 260px, 190px 230px, 240px 280px;
    opacity: .55;
}

.register-page .container {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 28px 16px 40px;
}

.register-page .container::before {
    content: "نظام تسجيل الموظفين والتصاريح\A إدارة متكاملة وسهلة لموظفيك وتصاريحهم في مكان واحد";
    white-space: pre-line;
    display: block;
    width: min(100%, 620px);
    min-height: 190px;
    padding: 122px 12px 22px;
    margin-bottom: 4px;
    text-align: center;
    color: #fff;
    font-size: clamp(14px, 3.6vw, 19px);
    font-weight: 700;
    line-height: 1.9;
    text-shadow: 0 2px 12px rgba(0, 15, 61, .65);
    background:
        url("https://drive.google.com/thumbnail?id=1kGjUhjS3uuabfRTP-W4t0Sk9fEw4JsBb&sz=w1000")
        center 4px / 175px 112px no-repeat;
}

.register-page .card {
    width: min(100%, 610px);
    padding: 26px 20px 22px;
    border: 1px solid rgba(255, 255, 255, .9);
    border-radius: 27px;
    background: linear-gradient(135deg, rgba(255, 255, 255, .96), rgba(226, 239, 255, .88));
    box-shadow: 0 18px 42px rgba(0, 14, 61, .38);
    backdrop-filter: blur(10px);
}

.register-page .card .title {
    position: relative;
    margin-bottom: 22px;
    padding: 0 0 17px;
    color: #1465e9;
    font-size: clamp(23px, 6vw, 31px);
    line-height: 1.35;
}

.register-page .card .title::after {
    content: "";
    position: absolute;
    right: 50%;
    bottom: 0;
    width: 120px;
    height: 3px;
    border-radius: 99px;
    background: linear-gradient(90deg, #00c8e8, #1565eb);
    transform: translateX(50%);
}

.register-page .card > hr,
.register-page form > hr {
    height: 1px;
    margin: 20px 0;
    border: 0;
    background: #b7d1f6;
}

.register-page .form-group {
    margin-bottom: 17px;
}

.register-page label {
    margin-bottom: 8px;
    color: #244274;
    font-size: 15px;
    font-weight: 800;
}

.register-page input[type=text],
.register-page select,
.register-page .custom-job-select {
    width: 100%;
    min-height: 52px;
    padding: 12px 14px !important;
    border: 1px solid #d5e2f8 !important;
    border-radius: 11px !important;
    color: #1e3767 !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    background: rgba(255, 255, 255, .92) !important;
    box-shadow: 0 5px 13px rgba(40, 94, 175, .08) !important;
}

.register-page input[type=text]::placeholder {
    color: #8a9bbc;
}

.register-page input[type=text]:focus,
.register-page select:focus,
.register-page .custom-job-select:focus {
    border-color: #1685f2 !important;
    box-shadow: 0 0 0 3px rgba(22, 133, 242, .16) !important;
    outline: none;
}

.register-page input[type=file] {
    width: 100%;
    padding: 13px;
    border: 1px dashed #78a9ef;
    border-radius: 12px;
    color: #3263a8;
    background: rgba(248, 252, 255, .9);
    cursor: pointer;
}

.register-page input[type=file]::file-selector-button {
    margin-left: 10px;
    padding: 8px 13px;
    border: 0;
    border-radius: 7px;
    color: #fff;
    font-family: Tahoma, Arial, sans-serif;
    font-weight: bold;
    background: linear-gradient(135deg, #1688f5, #1254db);
    cursor: pointer;
}

.register-page #cvContainer {
    border-color: #3c8dfa !important;
    border-radius: 13px !important;
    background: rgba(233, 244, 255, .86) !important;
}

.register-page .preview-img {
    max-width: 100%;
    max-height: 180px;
    margin: 12px auto 0;
    border: 1px solid #b7d4ff;
    border-radius: 10px;
    box-shadow: 0 7px 16px rgba(24, 86, 175, .12);
}

.register-page .alert-custom {
    border-radius: 12px;
    box-shadow: 0 7px 16px rgba(19, 59, 120, .1);
}

.register-page #submitBtn {
    min-height: 54px;
    margin-top: 10px !important;
    border-radius: 10px;
    font-weight: 800;
    background: linear-gradient(135deg, #11ba69, #07914c);
    box-shadow: 0 8px 16px rgba(0, 136, 69, .22);
}

.register-page #submitBtn:hover {
    background: linear-gradient(135deg, #0ba95e, #067c40);
}

.register-page .btn-secondary {
    min-height: 50px;
    border-radius: 10px;
    font-weight: 800;
    background: linear-gradient(135deg, #224b89, #102c62);
    box-shadow: 0 8px 16px rgba(7, 35, 83, .2);
}

.register-page .btn-secondary:hover {
    background: linear-gradient(135deg, #183e78, #0b214c);
}

.register-page #loading {
    color: #1565e5 !important;
}

@media (max-width: 480px) {
    .register-page .container {
        padding: 18px 11px 28px;
    }

    .register-page .container::before {
        min-height: 164px;
        padding-top: 105px;
        margin-bottom: 0;
        font-size: 14px;
        background-size: 145px 94px;
        background-position: center 2px;
    }

    .register-page .card {
        padding: 22px 13px 17px;
        border-radius: 22px;
    }

    .register-page .card .title {
        font-size: 24px;
    }

    .register-page label {
        font-size: 14px;
    }
}

/* =========================================
   صفحة تصريح شركة ثانية فقط
========================================= */

body.permit-page {
    min-height: 100vh;
    min-height: 100dvh;
    overflow-x: hidden;
    background:
        linear-gradient(rgba(2, 14, 55, .46), rgba(2, 14, 55, .72)),
        url("https://drive.google.com/thumbnail?id=1J8L55XgT49KP5beqo7jLtJAoBM3Y6TzQ&sz=w1600")
        center center / cover no-repeat;
    color: #17356d;
}

body.permit-page::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: .55;
    background:
        radial-gradient(circle at 8% 24%, rgba(38, 186, 255, .9) 0 2px, transparent 3px),
        radial-gradient(circle at 92% 35%, rgba(38, 186, 255, .9) 0 2px, transparent 3px),
        radial-gradient(circle at 18% 80%, rgba(38, 186, 255, .8) 0 2px, transparent 3px),
        radial-gradient(circle at 84% 75%, rgba(38, 186, 255, .8) 0 2px, transparent 3px);
    background-size: 170px 210px, 220px 260px, 190px 230px, 240px 280px;
}

.permit-page .container {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 28px 16px 40px;
}

.permit-page .container::before {
    content: "نظام تسجيل الموظفين والتصاريح\A إدارة متكاملة وسهلة لموظفيك وتصاريحهم في مكان واحد";
    white-space: pre-line;
    display: block;
    width: min(100%, 620px);
    min-height: 190px;
    padding: 122px 12px 22px;
    margin-bottom: 4px;
    text-align: center;
    color: #fff;
    font-size: clamp(14px, 3.6vw, 19px);
    font-weight: 700;
    line-height: 1.9;
    text-shadow: 0 2px 12px rgba(0, 15, 61, .65);
    background:
        url("https://drive.google.com/thumbnail?id=1kGjUhjS3uuabfRTP-W4t0Sk9fEw4JsBb&sz=w1000")
        center 4px / 175px 112px no-repeat;
}

.permit-page .card {
    width: min(100%, 610px);
    padding: 26px 20px 22px;
    border: 1px solid rgba(255, 255, 255, .9);
    border-radius: 27px;
    background: linear-gradient(135deg, rgba(255, 255, 255, .96), rgba(226, 239, 255, .88));
    box-shadow: 0 18px 42px rgba(0, 14, 61, .38);
    backdrop-filter: blur(10px);
}

.permit-page .card .title {
    position: relative;
    margin-bottom: 22px;
    padding: 0 0 17px;
    color: #f18c00;
    font-size: clamp(22px, 5.7vw, 30px);
    line-height: 1.35;
}

.permit-page .card .title::after {
    content: "";
    position: absolute;
    right: 50%;
    bottom: 0;
    width: 120px;
    height: 3px;
    border-radius: 99px;
    background: linear-gradient(90deg, #ffb300, #f27c00);
    transform: translateX(50%);
}

.permit-page .card > hr {
    height: 1px;
    margin: 20px 0;
    border: 0;
    background: #b7d1f6;
}

.permit-page .form-group {
    margin-bottom: 17px;
}

.permit-page label {
    margin-bottom: 8px;
    color: #244274;
    font-size: 15px;
    font-weight: 800;
}

.permit-page input[type=text],
.permit-page select,
.permit-page .custom-job-select {
    width: 100%;
    min-height: 52px;
    padding: 12px 14px !important;
    border: 1px solid #d5e2f8 !important;
    border-radius: 11px !important;
    color: #1e3767 !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    background: rgba(255, 255, 255, .92) !important;
    box-shadow: 0 5px 13px rgba(40, 94, 175, .08) !important;
}

.permit-page input[type=text]::placeholder {
    color: #8a9bbc;
}

.permit-page input[type=text]:focus,
.permit-page select:focus,
.permit-page .custom-job-select:focus {
    border-color: #1685f2 !important;
    box-shadow: 0 0 0 3px rgba(22, 133, 242, .16) !important;
    outline: none;
}

.permit-page input[type=file] {
    width: 100%;
    padding: 13px;
    border: 1px dashed #78a9ef;
    border-radius: 12px;
    color: #3263a8;
    background: rgba(248, 252, 255, .9);
    cursor: pointer;
}

.permit-page input[type=file]::file-selector-button {
    margin-left: 10px;
    padding: 8px 13px;
    border: 0;
    border-radius: 7px;
    color: #fff;
    font-family: Tahoma, Arial, sans-serif;
    font-weight: bold;
    background: linear-gradient(135deg, #1688f5, #1254db);
    cursor: pointer;
}

.permit-page .preview-image {
    max-width: 100%;
    max-height: 180px;
    margin: 12px auto 0;
    border: 1px solid #b7d4ff;
    border-radius: 10px;
    box-shadow: 0 7px 16px rgba(24, 86, 175, .12);
}

.permit-page .alert-banner,
.permit-page .alert-banner-success {
    border-radius: 12px;
    box-shadow: 0 7px 16px rgba(19, 59, 120, .1);
}

.permit-page .btn-success {
    min-height: 54px;
    margin-top: 10px;
    border-radius: 10px;
    font-weight: 800;
    background: linear-gradient(135deg, #11ba69, #07914c);
    box-shadow: 0 8px 16px rgba(0, 136, 69, .22);
}

.permit-page .btn-success:hover {
    background: linear-gradient(135deg, #0ba95e, #067c40);
}

.permit-page .btn-secondary {
    min-height: 50px;
    border-radius: 10px;
    font-weight: 800;
    background: linear-gradient(135deg, #224b89, #102c62);
    box-shadow: 0 8px 16px rgba(7, 35, 83, .2);
}

.permit-page .btn-secondary:hover {
    background: linear-gradient(135deg, #183e78, #0b214c);
}

.permit-page #loading {
    color: #1565e5 !important;
}

@media (max-width: 480px) {
    .permit-page .container {
        padding: 18px 11px 28px;
    }

    .permit-page .container::before {
        min-height: 164px;
        padding-top: 105px;
        margin-bottom: 0;
        font-size: 14px;
        background-size: 145px 94px;
        background-position: center 2px;
    }

    .permit-page .card {
        padding: 22px 13px 17px;
        border-radius: 22px;
    }

    .permit-page .card .title {
        font-size: 23px;
    }

    .permit-page label {
        font-size: 14px;
    }
}

/* =========================================
   صفحة تجديد التصاريح فقط
========================================= */

body.renew-page {
    min-height: 100vh;
    min-height: 100dvh;
    overflow-x: hidden;
    background:
        linear-gradient(rgba(2, 14, 55, .46), rgba(2, 14, 55, .72)),
        url("https://drive.google.com/thumbnail?id=1J8L55XgT49KP5beqo7jLtJAoBM3Y6TzQ&sz=w1600")
        center center / cover no-repeat;
    color: #17356d;
}

body.renew-page::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: .55;
    background:
        radial-gradient(circle at 8% 24%, rgba(38, 186, 255, .9) 0 2px, transparent 3px),
        radial-gradient(circle at 92% 35%, rgba(38, 186, 255, .9) 0 2px, transparent 3px),
        radial-gradient(circle at 18% 80%, rgba(38, 186, 255, .8) 0 2px, transparent 3px),
        radial-gradient(circle at 84% 75%, rgba(38, 186, 255, .8) 0 2px, transparent 3px);
    background-size: 170px 210px, 220px 260px, 190px 230px, 240px 280px;
}

.renew-page .container {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 28px 16px 40px;
}

.renew-page .container::before {
    content: "نظام تسجيل الموظفين والتصاريح\A إدارة متكاملة وسهلة لموظفيك وتصاريحهم في مكان واحد";
    white-space: pre-line;
    display: block;
    width: min(100%, 620px);
    min-height: 190px;
    padding: 122px 12px 22px;
    margin-bottom: 4px;
    text-align: center;
    color: #fff;
    font-size: clamp(14px, 3.6vw, 19px);
    font-weight: 700;
    line-height: 1.9;
    text-shadow: 0 2px 12px rgba(0, 15, 61, .65);
    background:
        url("https://drive.google.com/thumbnail?id=1kGjUhjS3uuabfRTP-W4t0Sk9fEw4JsBb&sz=w1000")
        center 4px / 175px 112px no-repeat;
}

.renew-page .card {
    width: min(100%, 610px);
    padding: 26px 20px 22px;
    border: 1px solid rgba(255, 255, 255, .9);
    border-radius: 27px;
    background: linear-gradient(135deg, rgba(255, 255, 255, .96), rgba(226, 239, 255, .88));
    box-shadow: 0 18px 42px rgba(0, 14, 61, .38);
    backdrop-filter: blur(10px);
}

.renew-page .card .title {
    position: relative;
    margin-bottom: 22px;
    padding: 0 0 17px;
    color: #087f99;
    font-size: clamp(23px, 5.8vw, 31px);
    line-height: 1.35;
}

.renew-page .card .title::after {
    content: "";
    position: absolute;
    right: 50%;
    bottom: 0;
    width: 120px;
    height: 3px;
    border-radius: 99px;
    background: linear-gradient(90deg, #00c8e8, #087f99);
    transform: translateX(50%);
}

.renew-page .card > hr {
    height: 1px;
    margin: 20px 0;
    border: 0;
    background: #b7d1f6;
}

.renew-page .form-group {
    margin-bottom: 17px;
}

.renew-page label {
    margin-bottom: 8px;
    color: #244274;
    font-size: 15px;
    font-weight: 800;
}

.renew-page input[type=text],
.renew-page select,
.renew-page .custom-job-select {
    width: 100%;
    min-height: 52px;
    padding: 12px 14px !important;
    border: 1px solid #d5e2f8 !important;
    border-radius: 11px !important;
    color: #1e3767 !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    background: rgba(255, 255, 255, .92) !important;
    box-shadow: 0 5px 13px rgba(40, 94, 175, .08) !important;
}

.renew-page input[type=text]::placeholder {
    color: #8a9bbc;
}

.renew-page input[type=text]:focus,
.renew-page select:focus,
.renew-page .custom-job-select:focus {
    border-color: #00a9c2 !important;
    box-shadow: 0 0 0 3px rgba(0, 169, 194, .16) !important;
    outline: none;
}

.renew-page input[type=file] {
    width: 100%;
    padding: 13px;
    border: 1px dashed #78a9ef;
    border-radius: 12px;
    color: #3263a8;
    background: rgba(248, 252, 255, .9);
    cursor: pointer;
}

.renew-page input[type=file]::file-selector-button {
    margin-left: 10px;
    padding: 8px 13px;
    border: 0;
    border-radius: 7px;
    color: #fff;
    font-family: Tahoma, Arial, sans-serif;
    font-weight: bold;
    background: linear-gradient(135deg, #10b5ca, #087eaf);
    cursor: pointer;
}

.renew-page .preview-image,
.renew-page .preview-img {
    max-width: 100%;
    max-height: 180px;
    margin: 12px auto 0;
    border: 1px solid #b7d4ff;
    border-radius: 10px;
    box-shadow: 0 7px 16px rgba(24, 86, 175, .12);
}

.renew-page .btn-success {
    min-height: 54px;
    margin-top: 10px;
    border-radius: 10px;
    font-weight: 800;
    background: linear-gradient(135deg, #18b7c7, #087ea5);
    box-shadow: 0 8px 16px rgba(0, 131, 156, .24);
}

.renew-page .btn-success:hover {
    background: linear-gradient(135deg, #0fa6b6, #066b91);
}

.renew-page .btn-secondary {
    min-height: 50px;
    border-radius: 10px;
    font-weight: 800;
    background: linear-gradient(135deg, #224b89, #102c62);
    box-shadow: 0 8px 16px rgba(7, 35, 83, .2);
}

.renew-page .btn-secondary:hover {
    background: linear-gradient(135deg, #183e78, #0b214c);
}

.renew-page #loading {
    color: #087eaf !important;
}

@media (max-width: 480px) {
    .renew-page .container {
        padding: 18px 11px 28px;
    }

    .renew-page .container::before {
        min-height: 164px;
        padding-top: 105px;
        margin-bottom: 0;
        font-size: 14px;
        background-size: 145px 94px;
        background-position: center 2px;
    }

    .renew-page .card {
        padding: 22px 13px 17px;
        border-radius: 22px;
    }

    .renew-page .card .title {
        font-size: 24px;
    }

    .renew-page label {
        font-size: 14px;
    }
}

/* =========================================
   صفحة البحث عن موظف
========================================= */

body.search-page {
    min-height: 100vh;
    min-height: 100dvh;
    overflow-x: hidden;
    background:
        linear-gradient(rgba(2,14,55,.45),rgba(2,14,55,.72)),
        url("https://drive.google.com/thumbnail?id=1J8L55XgT49KP5beqo7jLtJAoBM3Y6TzQ&sz=w1600")
        center center/cover no-repeat fixed;
}

body.search-page::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: .55;
    background:
        radial-gradient(circle at 8% 24%,rgba(38,186,255,.9) 0 2px,transparent 3px),
        radial-gradient(circle at 92% 35%,rgba(38,186,255,.9) 0 2px,transparent 3px),
        radial-gradient(circle at 18% 80%,rgba(38,186,255,.8) 0 2px,transparent 3px),
        radial-gradient(circle at 84% 75%,rgba(38,186,255,.8) 0 2px,transparent 3px);
    background-size: 170px 210px,220px 260px,190px 230px,240px 280px;
    z-index: 0;
}

.search-page .container {
    position: relative;
    z-index: 2;
    max-width: 720px;
    margin: auto;
    padding: 30px 15px 40px;
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.search-page .container::before {
    content: "";
    display: block;
    width: 170px;
    height: 170px;
    margin: 0 auto 15px;
    background: url("https://drive.google.com/thumbnail?id=1kGjUhjS3uuabfRTP-W4t0Sk9fEw4JsBb&sz=w1000")
    center/contain no-repeat;
}

.search-page .container::after {
    content: "نظام تسجيل الموظفين والتصاريح\Aإدارة متكاملة وسهلة لموظفيك وتصاريحهم في مكان واحد";
    white-space: pre-line;
    display: block;
    text-align: center;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    line-height: 1.9;
    margin-bottom: 25px;
    text-shadow: 0 2px 10px rgba(0,0,0,.5);
}

.search-page .card,
.search-page .search-card,
.search-page .result-card {
    background: rgba(255,255,255,.92);
    backdrop-filter: blur(14px);
    border-radius: 28px;
    border: 1px solid rgba(255,255,255,.7);
    box-shadow: 0 18px 45px rgba(0,0,0,.35);
    padding: 30px;
    width: 100%;
}

.search-page input[type=text] {
    height: 55px;
    border-radius: 12px;
    border: 1px solid #dbe6ff;
    background: #fff;
    font-size: 16px;
    font-weight: bold;
}

.search-page input[type=text]:focus {
    border-color: #1ea7ff;
    box-shadow: 0 0 0 4px rgba(30,167,255,.15);
}

.search-page button,
.search-page .btn {
    border: none;
    border-radius: 12px;
    font-weight: bold;
    transition: .3s;
}

.search-page .btn-primary {
    background: linear-gradient(135deg,#1f8cff,#0066ff);
}

.search-page .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,110,255,.3);
}

.search-page .btn-secondary {
    background: linear-gradient(135deg,#455a80,#26395d);
}

.search-page img {
    border-radius: 12px;
    border: 2px solid #d8e7ff;
    box-shadow: 0 10px 20px rgba(0,0,0,.15);
}

.search-page h2,
.search-page h3 {
    color: #1364dd;
    font-weight: 800;
}

.search-page hr {
    border-color: #d9e8ff;
}

@media(max-width:768px) {
    .search-page .container::before {
        width: 120px;
        height: 120px;
    }

    .search-page .container::after {
        font-size: 15px;
    }

    .search-page .card,
    .search-page .search-card,
    .search-page .result-card {
        padding: 20px;
        border-radius: 22px;
    }
}

/* ===== Search Header ===== */

.search-header {
    text-align: center;
    margin-bottom: 25px;
}

.search-logo {
    width: 170px;
    max-width: 45vw;
    display: block;
    margin: auto;
    filter: drop-shadow(0 10px 25px rgba(0,180,255,.45));
}

.search-header h1 {
    margin-top: 18px;
    margin-bottom: 12px;
    color: #fff;
    font-size: 40px;
    font-weight: 800;
}

</style>

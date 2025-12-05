// setup.js - ملف الإعداد التلقائي والمتكامل للنظام

(function() {
    'use strict';
    
    // === تهيئة النظام الأساسية ===
    
    // التحقق من توافق المتصفح
    function checkBrowserCompatibility() {
        const requiredAPIs = [
            'localStorage',
            'JSON',
            'querySelector',
            'addEventListener',
            'classList',
            'forEach'
        ];
        
        const missingAPIs = requiredAPIs.filter(api => !(api in window));
        
        if (missingAPIs.length > 0) {
            const errorMessage = `
                ⚠️ متصفحك لا يدعم بعض الميزات المطلوبة:
                ${missingAPIs.join(', ')}
                
                يرجى استخدام متصفح حديث مثل:
                • Chrome 60+
                • Firefox 55+
                • Safari 11+
                • Edge 79+
            `;
            
            alert(errorMessage);
            return false;
        }
        
        return true;
    }
    
    // === إنشاء بيانات النظام الافتراضية ===
    
    function createDefaultSystemData() {
        console.log('🔄 إنشاء بيانات النظام الافتراضية...');
        
        // الإعدادات الأساسية للنظام
        const systemConfig = {
            // معلومات النظام
            system: {
                name: "ClinicPro",
                version: "1.0.0",
                author: "نظام حجز مواعيد العيادات",
                created: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            },
            
            // معلومات العيادة الافتراضية
            clinic: {
                name: "عيادة النخبة الطبية",
                specialty: "تخصصات متعددة - رعاية متكاملة",
                phone: "0112345678",
                whatsapp: "0551234567",
                email: "info@clinic.com",
                address: "شارع الملك فهد، الرياض، المملكة العربية السعودية",
                logo: "",
                colors: {
                    primary: "#2D5BFF",
                    secondary: "#00C9A7",
                    accent: "#FF6B9D",
                    dark: "#1A237E",
                    light: "#F8F9FF"
                },
                description: "عيادة متكاملة تقدم أفضل الخدمات الطبية بأعلى معايير الجودة"
            },
            
            // الأطباء الافتراضيون
            doctors: [
                {
                    id: "DR001",
                    name: "د. أحمد محمد",
                    specialty: "أسنان",
                    phone: "0551111111",
                    email: "ahmed@clinic.com",
                    bio: "طبيب أسنان متخصص مع 10 سنوات خبرة",
                    availability: "9:00-17:00",
                    active: true,
                    photo: "",
                    createdAt: new Date().toISOString()
                },
                {
                    id: "DR002",
                    name: "د. سارة علي",
                    specialty: "باطنة",
                    phone: "0552222222",
                    email: "sara@clinic.com",
                    bio: "استشارية باطنة متخصصة في الأمراض الداخلية",
                    availability: "9:00-17:00",
                    active: true,
                    photo: "",
                    createdAt: new Date().toISOString()
                },
                {
                    id: "DR003",
                    name: "د. خالد حسن",
                    specialty: "عيون",
                    phone: "0553333333",
                    email: "khaled@clinic.com",
                    bio: "استشاري عيون متخصص في جراحة العيون",
                    availability: "9:00-17:00",
                    active: true,
                    photo: "",
                    createdAt: new Date().toISOString()
                }
            ],
            
            // أوقات العمل الافتراضية
            workingHours: {
                sunday: { open: "09:00", close: "17:00", active: true },
                monday: { open: "09:00", close: "17:00", active: true },
                tuesday: { open: "09:00", close: "17:00", active: true },
                wednesday: { open: "09:00", close: "17:00", active: true },
                thursday: { open: "09:00", close: "17:00", active: true },
                friday: { open: "16:00", close: "20:00", active: true },
                saturday: { open: "09:00", close: "14:00", active: false }
            },
            
            // إعدادات الحجز الافتراضية
            booking: {
                // الأوقات
                slotDuration: 30, // دقائق لكل موعد
                bufferTime: 10,   // دقائق بين المواعيد
                
                // القيود
                maxDailyBookings: 50,
                minBookingHours: 2,   // أقل وقت للحجز المسبق
                maxBookingDays: 30,   // أقصى وقت للحجز المسبق
                cancellationHours: 24, // أقل وقت للإلغاء
                
                // الخيارات
                allowOnlineBooking: true,
                requireDeposit: false,
                depositAmount: 50,
                autoConfirm: true,
                multipleDoctors: true,
                
                // الرسوم
                consultationFee: 200,
                followUpFee: 100,
                emergencyFee: 300
            },
            
            // إعدادات الإشعارات
            notifications: {
                whatsapp: {
                    enabled: true,
                    confirmation: true,
                    reminder24h: true,
                    reminder3h: false,
                    followup: true,
                    
                    // قوالب الرسائل
                    templates: {
                        confirmation: `🎯 تأكيد حجز موعد طبي

✅ تم حجز موعدك بنجاح!

👤 المريض: {{patientName}}
📞 الهاتف: {{patientPhone}}
👨‍⚕️ الطبيب: {{doctorName}}
📅 التاريخ: {{appointmentDate}}
⏰ الوقت: {{appointmentTime}}

📍 العنوان: {{clinicAddress}}
📞 الهاتف: {{clinicPhone}}

يرجى الحضور قبل الموعد بـ 10 دقائق.
للتعديل أو الإلغاء، اتصل بالعيادة.

شكراً لثقتك بنا ❤️`,
                        
                        reminder: `⏰ تذكير بموعدك غداً

👤 عزيزي {{patientName}},
هذا تذكير بموعدك في عيادتنا:

👨‍⚕️ الطبيب: {{doctorName}}
📅 التاريخ: {{appointmentDate}}
⏰ الوقت: {{appointmentTime}}

📍 العنوان: {{clinicAddress}}
📞 الهاتف: {{clinicPhone}}

يرجى الحضور قبل الموعد بـ 10 دقائق.
للتعديل أو الإلغاء، اتصل بالعيادة.`
                    }
                },
                
                sms: {
                    enabled: false,
                    confirmation: false,
                    reminder24h: false,
                    provider: "",
                    apiKey: "",
                    senderId: "ClinicPro"
                }
            },
            
            // إعدادات الدفع
            payment: {
                currency: "SAR",
                currencySymbol: "ريال",
                requirePayment: false,
                depositAmount: 50,
                paymentMethods: ["cash", "card"],
                taxRate: 0,
                taxIncluded: true
            },
            
            // إعدادات الحساب
            admin: {
                username: "admin",
                password: "clinic123", // سيتم تشفيره في الإصدار الإنتاجي
                fullName: "مدير النظام",
                email: "admin@clinic.com",
                phone: "0550000000",
                role: "admin",
                permissions: ["all"],
                lastLogin: null,
                createdAt: new Date().toISOString()
            },
            
            // إعدادات الواجهة
            ui: {
                language: "ar",
                direction: "rtl",
                theme: "light",
                fontSize: "medium",
                animations: true
            }
        };
        
        // === حفظ البيانات في localStorage ===
        
        try {
            // الإعدادات الرئيسية
            localStorage.setItem('clinic_settings', JSON.stringify(systemConfig, null, 2));
            
            // البيانات التشغيلية
            localStorage.setItem('clinic_bookings', JSON.stringify([]));
            localStorage.setItem('clinic_patients', JSON.stringify([]));
            localStorage.setItem('clinic_payments', JSON.stringify([]));
            
            // الإحصائيات
            localStorage.setItem('clinic_stats', JSON.stringify({
                total: {
                    bookings: 0,
                    patients: 0,
                    revenue: 0,
                    completed: 0,
                    cancelled: 0
                },
                monthly: {},
                daily: {},
                doctors: {},
                lastUpdated: new Date().toISOString()
            }));
            
            // سجل الأنشطة
            localStorage.setItem('clinic_activity', JSON.stringify([{
                type: 'system_init',
                message: 'تم تهيئة النظام لأول مرة',
                timestamp: new Date().toISOString(),
                details: systemConfig
            }]));
            
            // علامات النظام
            localStorage.setItem('clinic_initialized', 'true');
            localStorage.setItem('clinic_init_date', new Date().toISOString());
            localStorage.setItem('clinic_version', systemConfig.system.version);
            
            console.log('✅ تم إنشاء بيانات النظام الافتراضية بنجاح');
            return true;
            
        } catch (error) {
            console.error('❌ خطأ في إنشاء البيانات:', error);
            alert('حدث خطأ في تهيئة النظام. يرجى تحديث الصفحة أو استخدام متصفح آخر.');
            return false;
        }
    }
    
    // === تحميل الإعدادات على الصفحة ===
    
    function loadSettingsToPage() {
        try {
            const settings = getSystemSettings();
            
            if (!settings) {
                console.warn('⚠️ لا توجد إعدادات مخزنة');
                return;
            }
            
            // تطبيق ألوان الثيم
            applyThemeColors(settings.clinic?.colors);
            
            // تحديث معلومات العيادة
            updateClinicInfo(settings.clinic);
            
            // تحديث إعدادات الحجز
            updateBookingSettings(settings.booking);
            
            // تحديث قائمة الأطباء
            updateDoctorsList(settings.doctors);
            
            console.log('✅ تم تحميل الإعدادات على الصفحة');
            
        } catch (error) {
            console.error('❌ خطأ في تحميل الإعدادات:', error);
        }
    }
    
    function applyThemeColors(colors) {
        if (!colors) return;
        
        const styleId = 'clinic-theme-colors';
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = `
            :root {
                --primary-color: ${colors.primary};
                --secondary-color: ${colors.secondary};
                --accent-color: ${colors.accent};
                --dark-color: ${colors.dark};
                --light-color: ${colors.light};
                
                --primary-rgb: ${hexToRgb(colors.primary)};
                --secondary-rgb: ${hexToRgb(colors.secondary)};
                --accent-rgb: ${hexToRgb(colors.accent)};
            }
            
            .primary-bg { background-color: ${colors.primary} !important; }
            .secondary-bg { background-color: ${colors.secondary} !important; }
            .accent-bg { background-color: ${colors.accent} !important; }
            
            .primary-text { color: ${colors.primary} !important; }
            .secondary-text { color: ${colors.secondary} !important; }
            .accent-text { color: ${colors.accent} !important; }
            
            .btn-primary {
                background: ${colors.primary};
                border-color: ${colors.primary};
            }
            
            .btn-secondary {
                background: ${colors.secondary};
                border-color: ${colors.secondary};
            }
            
            .btn-accent {
                background: ${colors.accent};
                border-color: ${colors.accent};
            }
        `;
    }
    
    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
    }
    
    function updateClinicInfo(clinicInfo) {
        if (!clinicInfo) return;
        
        // تحديث title الصفحة
        if (clinicInfo.name && !document.title.includes(clinicInfo.name)) {
            document.title = clinicInfo.name + ' - ' + document.title;
        }
        
        // تحديث عناصر المعلومات العامة
        document.querySelectorAll('[data-clinic-name]').forEach(el => {
            el.textContent = clinicInfo.name;
        });
        
        document.querySelectorAll('[data-clinic-phone]').forEach(el => {
            el.textContent = clinicInfo.phone;
            if (el.tagName === 'A' && !el.href.includes('tel:')) {
                el.href = `tel:${clinicInfo.phone}`;
            }
        });
        
        document.querySelectorAll('[data-clinic-whatsapp]').forEach(el => {
            el.textContent = clinicInfo.whatsapp;
            if (el.tagName === 'A' && !el.href.includes('wa.me')) {
                const message = encodeURIComponent('مرحباً، أريد الاستفسار عن موعد');
                el.href = `https://wa.me/${clinicInfo.whatsapp}?text=${message}`;
            }
        });
        
        document.querySelectorAll('[data-clinic-email]').forEach(el => {
            el.textContent = clinicInfo.email;
            if (el.tagName === 'A' && !el.href.includes('mailto:')) {
                el.href = `mailto:${clinicInfo.email}`;
            }
        });
        
        document.querySelectorAll('[data-clinic-address]').forEach(el => {
            el.textContent = clinicInfo.address;
        });
        
        document.querySelectorAll('[data-clinic-specialty]').forEach(el => {
            el.textContent = clinicInfo.specialty;
        });
    }
    
    function updateBookingSettings(bookingSettings) {
        if (!bookingSettings) return;
        
        // تحديث إعدادات الحجز في النماذج
        const slotDurationInputs = document.querySelectorAll('[data-slot-duration]');
        slotDurationInputs.forEach(input => {
            input.value = bookingSettings.slotDuration || 30;
        });
        
        const bufferTimeInputs = document.querySelectorAll('[data-buffer-time]');
        bufferTimeInputs.forEach(input => {
            input.value = bookingSettings.bufferTime || 10;
        });
        
        // تحديث رسوم الاستشارة
        const feeElements = document.querySelectorAll('[data-consultation-fee]');
        feeElements.forEach(el => {
            el.textContent = (bookingSettings.consultationFee || 200).toLocaleString() + ' ريال';
        });
    }
    
    function updateDoctorsList(doctors) {
        if (!doctors || !Array.isArray(doctors)) return;
        
        // تحديث قوائم اختيار الأطباء
        const doctorSelects = document.querySelectorAll('select[data-doctors-list]');
        doctorSelects.forEach(select => {
            // حفظ القيمة المحددة حالياً
            const currentValue = select.value;
            
            // تفريغ الخيارات
            select.innerHTML = '<option value="">-- اختر الطبيب --</option>';
            
            // إضافة الأطباء النشطين فقط
            doctors.filter(doctor => doctor.active !== false).forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = `${doctor.name} - ${doctor.specialty}`;
                option.dataset.doctorId = doctor.id;
                select.appendChild(option);
            });
            
            // استعادة القيمة المحددة إذا كانت موجودة
            if (currentValue) {
                select.value = currentValue;
            }
        });
        
        // تحديث عرض قائمة الأطباء
        const doctorsContainers = document.querySelectorAll('[data-doctors-display]');
        doctorsContainers.forEach(container => {
            if (container.dataset.doctorsDisplay === 'list') {
                container.innerHTML = '';
                doctors.forEach(doctor => {
                    if (doctor.active !== false) {
                        const doctorDiv = document.createElement('div');
                        doctorDiv.className = 'doctor-item';
                        doctorDiv.innerHTML = `
                            <div class="doctor-info">
                                <h4>${doctor.name}</h4>
                                <p>${doctor.specialty}</p>
                                ${doctor.bio ? `<p class="doctor-bio">${doctor.bio}</p>` : ''}
                                ${doctor.phone ? `<p class="doctor-phone">📞 ${doctor.phone}</p>` : ''}
                            </div>
                        `;
                        container.appendChild(doctorDiv);
                    }
                });
            }
        });
    }
    
    // === نظام المصادقة ===
    
    function setupAuthentication() {
        // التحقق من حالة الدخول
        const isLoggedIn = checkLoginStatus();
        const currentPage = window.location.pathname;
        
        // الصفحات التي تتطلب تسجيل دخول
        const protectedPages = ['dashboard.html', 'settings.html'];
        const isProtectedPage = protectedPages.some(page => currentPage.includes(page));
        
        // إذا كانت الصفحة محمية والمستخدم غير مسجل
        if (isProtectedPage && !isLoggedIn) {
            redirectToLogin();
            return false;
        }
        
        // إذا كان المستخدم مسجلاً، تحديث واجهة المستخدم
        if (isLoggedIn) {
            updateUserInterface();
        }
        
        // إعداد أحداث تسجيل الدخول/الخروج
        setupAuthEvents();
        
        return isLoggedIn;
    }
    
    function checkLoginStatus() {
        const userData = localStorage.getItem('clinic_user');
        const loggedIn = localStorage.getItem('clinic_logged_in');
        
        if (!userData || loggedIn !== 'true') {
            return false;
        }
        
        try {
            const user = JSON.parse(userData);
            
            // التحقق من انتهاء الجلسة (24 ساعة)
            if (user.loginTime) {
                const loginTime = new Date(user.loginTime);
                const now = new Date();
                const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
                
                if (hoursDiff > 24) {
                    logoutUser();
                    return false;
                }
            }
            
            return true;
        } catch (error) {
            console.error('❌ خطأ في تحليل بيانات المستخدم:', error);
            return false;
        }
    }
    
    function redirectToLogin() {
        // إذا كنا في صفحة محمية، توجيه إلى index.html
        if (!window.location.pathname.includes('index.html') && 
            !window.location.pathname.includes('demo.html') &&
            !window.location.pathname.includes('booking.html')) {
            
            // حفظ الصفحة الحالية للعودة إليها بعد التسجيل
            localStorage.setItem('clinic_redirect', window.location.href);
            
            // توجيه إلى الصفحة الرئيسية
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 100);
        }
    }
    
    function updateUserInterface() {
        try {
            const userData = JSON.parse(localStorage.getItem('clinic_user'));
            
            // تحديث اسم المستخدم في الواجهة
            document.querySelectorAll('[data-user-name]').forEach(el => {
                el.textContent = userData.fullName || userData.username;
            });
            
            // تحديث دور المستخدم
            document.querySelectorAll('[data-user-role]').forEach(el => {
                el.textContent = userData.role === 'admin' ? 'مدير النظام' : 'مستخدم';
            });
            
            // إظهار/إخفاء العناصر حسب الصلاحيات
            if (userData.role !== 'admin') {
                document.querySelectorAll('[data-role="admin"]').forEach(el => {
                    el.style.display = 'none';
                });
            }
            
        } catch (error) {
            console.error('❌ خطأ في تحديث واجهة المستخدم:', error);
        }
    }
    
    function setupAuthEvents() {
        // أحداث تسجيل الدخول
        const loginForms = document.querySelectorAll('form[data-login-form]');
        loginForms.forEach(form => {
            form.addEventListener('submit', handleLogin);
        });
        
        // أحداث تسجيل الخروج
        const logoutButtons = document.querySelectorAll('[data-logout]');
        logoutButtons.forEach(button => {
            button.addEventListener('click', handleLogout);
        });
        
        // أحداث تغيير كلمة المرور
        const changePasswordForms = document.querySelectorAll('form[data-change-password]');
        changePasswordForms.forEach(form => {
            form.addEventListener('submit', handleChangePassword);
        });
    }
    
    function handleLogin(event) {
        event.preventDefault();
        
        const form = event.target;
        const username = form.querySelector('[name="username"]').value.trim();
        const password = form.querySelector('[name="password"]').value.trim();
        
        try {
            const settings = getSystemSettings();
            
            if (!settings || !settings.admin) {
                showMessage('error', 'خطأ في النظام', 'الإعدادات غير موجودة');
                return;
            }
            
            // التحقق من بيانات الدخول
            if (username === settings.admin.username && password === settings.admin.password) {
                // تحديث وقت آخر دخول
                settings.admin.lastLogin = new Date().toISOString();
                localStorage.setItem('clinic_settings', JSON.stringify(settings));
                
                // حفظ بيانات المستخدم
                const userData = {
                    username: settings.admin.username,
                    fullName: settings.admin.fullName,
                    email: settings.admin.email,
                    phone: settings.admin.phone,
                    role: settings.admin.role,
                    permissions: settings.admin.permissions,
                    loginTime: new Date().toISOString()
                };
                
                localStorage.setItem('clinic_user', JSON.stringify(userData));
                localStorage.setItem('clinic_logged_in', 'true');
                
                // تسجيل النشاط
                logActivity('user_login', `تسجيل دخول: ${username}`);
                
                // إظهار رسالة النجاح
                showMessage('success', 'مرحباً بعودتك!', 'تم تسجيل الدخول بنجاح');
                
                // توجيه إلى لوحة التحكم أو الصفحة المحفوظة
                const redirectUrl = localStorage.getItem('clinic_redirect') || 'dashboard.html';
                localStorage.removeItem('clinic_redirect');
                
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 1500);
                
            } else {
                showMessage('error', 'بيانات غير صحيحة', 'اسم المستخدم أو كلمة المرور غير صحيحة');
            }
            
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error);
            showMessage('error', 'خطأ في النظام', 'حدث خطأ أثناء تسجيل الدخول');
        }
    }
    
    function handleLogout(event) {
        event.preventDefault();
        
        if (confirm('هل تريد تسجيل الخروج؟')) {
            logoutUser();
            showMessage('success', 'تم تسجيل الخروج', 'تم تسجيل الخروج بنجاح');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }
    
    function logoutUser() {
        const userData = JSON.parse(localStorage.getItem('clinic_user') || '{}');
        
        // تسجيل النشاط
        logActivity('user_logout', `تسجيل خروج: ${userData.username}`);
        
        // مسح بيانات الجلسة
        localStorage.removeItem('clinic_user');
        localStorage.removeItem('clinic_logged_in');
        
        // مسح التوجيه المحفوظ
        localStorage.removeItem('clinic_redirect');
    }
    
    function handleChangePassword(event) {
        event.preventDefault();
        
        const form = event.target;
        const currentPassword = form.querySelector('[name="current_password"]').value;
        const newPassword = form.querySelector('[name="new_password"]').value;
        const confirmPassword = form.querySelector('[name="confirm_password"]').value;
        
        try {
            const settings = getSystemSettings();
            
            // التحقق من كلمة المرور الحالية
            if (currentPassword !== settings.admin.password) {
                showMessage('error', 'خطأ', 'كلمة المرور الحالية غير صحيحة');
                return;
            }
            
            // التحقق من تطابق كلمتي المرور الجديدة
            if (newPassword !== confirmPassword) {
                showMessage('error', 'خطأ', 'كلمتا المرور غير متطابقتين');
                return;
            }
            
            // التحقق من قوة كلمة المرور
            if (newPassword.length < 6) {
                showMessage('error', 'ضعيفة', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
                return;
            }
            
            // تحديث كلمة المرور
            settings.admin.password = newPassword;
            localStorage.setItem('clinic_settings', JSON.stringify(settings));
            
            // تسجيل النشاط
            logActivity('password_change', 'تم تغيير كلمة المرور');
            
            // إظهار رسالة النجاح
            showMessage('success', 'تم التحديث', 'تم تغيير كلمة المرور بنجاح');
            
            // تفريغ النموذج
            form.reset();
            
        } catch (error) {
            console.error('❌ خطأ في تغيير كلمة المرور:', error);
            showMessage('error', 'خطأ في النظام', 'حدث خطأ أثناء تغيير كلمة المرور');
        }
    }
    
    // === إدارة البيانات ===
    
    function getSystemSettings() {
        try {
            const settings = localStorage.getItem('clinic_settings');
            return settings ? JSON.parse(settings) : null;
        } catch (error) {
            console.error('❌ خطأ في قراءة الإعدادات:', error);
            return null;
        }
    }
    
    function saveSystemSettings(settings) {
        try {
            // تحديث وقت التعديل
            settings.system.lastUpdated = new Date().toISOString();
            
            localStorage.setItem('clinic_settings', JSON.stringify(settings, null, 2));
            
            // تحديث الصفحة
            loadSettingsToPage();
            
            // تسجيل النشاط
            logActivity('settings_update', 'تم تحديث إعدادات النظام');
            
            return true;
        } catch (error) {
            console.error('❌ خطأ في حفظ الإعدادات:', error);
            return false;
        }
    }
    
    function getBookings() {
        try {
            const bookings = localStorage.getItem('clinic_bookings');
            return bookings ? JSON.parse(bookings) : [];
        } catch (error) {
            console.error('❌ خطأ في قراءة الحجوزات:', error);
            return [];
        }
    }
    
    function saveBooking(bookingData) {
        try {
            const bookings = getBookings();
            
            // توليد ID فريد للحجز
            if (!bookingData.id) {
                bookingData.id = generateBookingId();
            }
            
            // إضافة بيانات إضافية
            bookingData.createdAt = bookingData.createdAt || new Date().toISOString();
            bookingData.updatedAt = new Date().toISOString();
            
            // إضافة للحجوزات
            bookings.push(bookingData);
            
            // حفظ في localStorage
            localStorage.setItem('clinic_bookings', JSON.stringify(bookings));
            
            // تحديث الإحصائيات
            updateStatistics();
            
            // تسجيل النشاط
            logActivity('booking_create', `حجز جديد: ${bookingData.id}`);
            
            return bookingData.id;
            
        } catch (error) {
            console.error('❌ خطأ في حفظ الحجز:', error);
            return null;
        }
    }
    
    function updateBooking(bookingId, updates) {
        try {
            const bookings = getBookings();
            const bookingIndex = bookings.findIndex(b => b.id === bookingId);
            
            if (bookingIndex === -1) {
                throw new Error('الحجز غير موجود');
            }
            
            // تحديث البيانات
            bookings[bookingIndex] = {
                ...bookings[bookingIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            
            // الحفظ
            localStorage.setItem('clinic_bookings', JSON.stringify(bookings));
            
            // تسجيل النشاط
            logActivity('booking_update', `تحديث حجز: ${bookingId}`);
            
            // تحديث الإحصائيات
            updateStatistics();
            
            return true;
            
        } catch (error) {
            console.error('❌ خطأ في تحديث الحجز:', error);
            return false;
        }
    }
    
    function deleteBooking(bookingId) {
        try {
            let bookings = getBookings();
            const initialLength = bookings.length;
            
            // تصفية الحجوزات
            bookings = bookings.filter(b => b.id !== bookingId);
            
            if (bookings.length === initialLength) {
                throw new Error('الحجز غير موجود');
            }
            
            // الحفظ
            localStorage.setItem('clinic_bookings', JSON.stringify(bookings));
            
            // تسجيل النشاط
            logActivity('booking_delete', `حذف حجز: ${bookingId}`);
            
            // تحديث الإحصائيات
            updateStatistics();
            
            return true;
            
        } catch (error) {
            console.error('❌ خطأ في حذف الحجز:', error);
            return false;
        }
    }
    
    function generateBookingId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5).toUpperCase();
        return `BK${timestamp}${random}`;
    }
    
    function updateStatistics() {
        try {
            const bookings = getBookings();
            const today = new Date().toISOString().split('T')[0];
            
            const stats = {
                total: {
                    bookings: bookings.length,
                    patients: new Set(bookings.map(b => b.phone)).size,
                    revenue: bookings
                        .filter(b => b.status === 'confirmed' || b.status === 'completed')
                        .reduce((sum, b) => sum + (b.paymentAmount || 0), 0),
                    completed: bookings.filter(b => b.status === 'completed').length,
                    cancelled: bookings.filter(b => b.status === 'cancelled').length
                },
                today: {
                    bookings: bookings.filter(b => b.date === today).length,
                    revenue: bookings
                        .filter(b => b.date === today && (b.status === 'confirmed' || b.status === 'completed'))
                        .reduce((sum, b) => sum + (b.paymentAmount || 0), 0)
                },
                lastUpdated: new Date().toISOString()
            };
            
            // حساب الإحصائيات الشهرية
            const monthlyStats = {};
            bookings.forEach(booking => {
                const month = booking.date.substr(0, 7); // YYYY-MM
                
                if (!monthlyStats[month]) {
                    monthlyStats[month] = {
                        bookings: 0,
                        revenue: 0,
                        patients: new Set()
                    };
                }
                
                monthlyStats[month].bookings++;
                monthlyStats[month].revenue += booking.paymentAmount || 0;
                monthlyStats[month].patients.add(booking.phone);
            });
            
            // تحويل Set إلى عدد
            Object.keys(monthlyStats).forEach(month => {
                monthlyStats[month].patients = monthlyStats[month].patients.size;
            });
            
            stats.monthly = monthlyStats;
            
            // حفظ الإحصائيات
            localStorage.setItem('clinic_stats', JSON.stringify(stats));
            
            // تحديث العرض إذا كان موجوداً
            updateStatsDisplay(stats);
            
            return stats;
            
        } catch (error) {
            console.error('❌ خطأ في تحديث الإحصائيات:', error);
            return null;
        }
    }
    
    function updateStatsDisplay(stats) {
        // تحديث عداد الحجوزات
        document.querySelectorAll('[data-stats-bookings]').forEach(el => {
            el.textContent = stats?.total?.bookings?.toLocaleString() || '0';
        });
        
        // تحديث عداد المرضى
        document.querySelectorAll('[data-stats-patients]').forEach(el => {
            el.textContent = stats?.total?.patients?.toLocaleString() || '0';
        });
        
        // تحديث عداد الإيرادات
        document.querySelectorAll('[data-stats-revenue]').forEach(el => {
            const revenue = stats?.total?.revenue || 0;
            el.textContent = revenue.toLocaleString() + ' ريال';
        });
        
        // تحديث حجوزات اليوم
        document.querySelectorAll('[data-stats-today-bookings]').forEach(el => {
            el.textContent = stats?.today?.bookings?.toLocaleString() || '0';
        });
        
        // تحديث إيرادات اليوم
        document.querySelectorAll('[data-stats-today-revenue]').forEach(el => {
            const revenue = stats?.today?.revenue || 0;
            el.textContent = revenue.toLocaleString() + ' ريال';
        });
    }
    
    // === وظائف المساعدة ===
    
    function showMessage(type, title, message) {
        const messageTypes = {
            success: { icon: '✅', color: '#28a745' },
            error: { icon: '❌', color: '#dc3545' },
            warning: { icon: '⚠️', color: '#ffc107' },
            info: { icon: 'ℹ️', color: '#17a2b8' }
        };
        
        const config = messageTypes[type] || messageTypes.info;
        
        // إنشاء عنصر الرسالة
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            border-right: 5px solid ${config.color};
            max-width: 400px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        messageDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="font-size: 24px;">${config.icon}</div>
                <div>
                    <div style="font-weight: bold; color: #333; margin-bottom: 5px;">${title}</div>
                    <div style="color: #666;">${message}</div>
                </div>
            </div>
        `;
        
        // إضافة أنيميشن
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // إضافة للصفحة
        document.body.appendChild(messageDiv);
        
        // إزالة تلقائية بعد 5 ثوان
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 5000);
    }
    
    function logActivity(type, message, details = null) {
        try {
            const activities = JSON.parse(localStorage.getItem('clinic_activity') || '[]');
            const userData = JSON.parse(localStorage.getItem('clinic_user') || '{}');
            
            const activity = {
                id: 'ACT' + Date.now().toString(36),
                type,
                message,
                details,
                user: userData.username || 'system',
                timestamp: new Date().toISOString(),
                ip: 'local' // في الإنتاج، نحصل على IP المستخدم
            };
            
            activities.push(activity);
            
            // الحفاظ على آخر 100 نشاط فقط
            if (activities.length > 100) {
                activities.splice(0, activities.length - 100);
            }
            
            localStorage.setItem('clinic_activity', JSON.stringify(activities));
            
        } catch (error) {
            console.error('❌ خطأ في تسجيل النشاط:', error);
        }
    }
    
    function formatDate(dateString, format = 'full') {
        const date = new Date(dateString);
        
        const formats = {
            short: date.toLocaleDateString('ar-EG'),
            medium: date.toLocaleDateString('ar-EG', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            full: date.toLocaleDateString('ar-EG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            time: date.toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        return formats[format] || formats.full;
    }
    
    function formatCurrency(amount, currency = 'SAR') {
        return new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
    
    function validatePhoneNumber(phone) {
        // التحقق من رقم هاتف سعودي
        const saudiRegex = /^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
        const cleanedPhone = phone.replace(/\D/g, '');
        return saudiRegex.test(cleanedPhone);
    }
    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // === تهيئة النظام الكاملة ===
    
    function initializeSystem() {
        console.log('🚀 بدء تهيئة نظام ClinicPro...');
        
        // 1. التحقق من توافق المتصفح
        if (!checkBrowserCompatibility()) {
            return false;
        }
        
        // 2. التحقق إذا كان النظام مهيأ
        const isInitialized = localStorage.getItem('clinic_initialized') === 'true';
        
        if (!isInitialized) {
            console.log('🔄 هذا أول تشغيل للنظام، جاري التهيئة...');
            
            // إنشاء البيانات الافتراضية
            if (!createDefaultSystemData()) {
                showMessage('error', 'خطأ في التهيئة', 'تعذر تهيئة النظام');
                return false;
            }
            
            // عرض رسالة ترحيب
            setTimeout(() => {
                showMessage('success', 'مرحباً!', 'تم تهيئة النظام بنجاح');
            }, 1000);
        }
        
        // 3. تحميل الإعدادات على الصفحة
        loadSettingsToPage();
        
        // 4. إعداد نظام المصادقة
        setupAuthentication();
        
        // 5. تحديث الإحصائيات
        updateStatistics();
        
        // 6. إعداد الوظائف العامة
        setupGlobalFunctions();
        
        console.log('✅ نظام ClinicPro جاهز للعمل!');
        
        // تسجيل بدء التشغيل
        logActivity('system_start', 'بدء تشغيل النظام');
        
        return true;
    }
    
    function setupGlobalFunctions() {
        // جعل الوظائف متاحة عالمياً
        window.ClinicSystem = {
            // البيانات
            getSettings: getSystemSettings,
            saveSettings: saveSystemSettings,
            getBookings: getBookings,
            saveBooking: saveBooking,
            updateBooking: updateBooking,
            deleteBooking: deleteBooking,
            
            // الإحصائيات
            getStats: updateStatistics,
            updateStats: updateStatistics,
            
            // المصادقة
            login: handleLogin,
            logout: logoutUser,
            isLoggedIn: checkLoginStatus,
            
            // المساعدة
            showMessage: showMessage,
            formatDate: formatDate,
            formatCurrency: formatCurrency,
            validatePhone: validatePhoneNumber,
            validateEmail: validateEmail,
            
            // النظام
            initialize: initializeSystem,
            version: '1.0.0'
        };
        
        // وظائف سريعة للاستخدام
        window.$showSuccess = (title, message) => showMessage('success', title, message);
        window.$showError = (title, message) => showMessage('error', title, message);
        window.$formatDate = formatDate;
        window.$formatMoney = formatCurrency;
    }
    
    // === بدء التشغيل ===
    
    // انتظار تحميل DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSystem);
    } else {
        initializeSystem();
    }
    
})();

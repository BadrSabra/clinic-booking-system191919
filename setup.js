
// setup.js - ملف التهيئة والإدارة المركزي للنظام
(function() {
    'use strict';
    
    // === نظام التهيئة الأساسية ===
    
    // التحقق من توافق المتصفح
    function checkBrowserCompatibility() {
        const requiredAPIs = ['localStorage', 'JSON'];
        
        for (const api of requiredAPIs) {
            if (!(api in window)) {
                console.error(`❌ المتصفح لا يدعم ${api}`);
                return false;
            }
        }
        return true;
    }
    
    // === إدارة البيانات الموحدة ===
    
    const DataManager = {
        // الحصول على إعدادات النظام
        getSettings() {
            try {
                return JSON.parse(localStorage.getItem('clinic_settings')) || this.getDefaultSettings();
            } catch {
                return this.getDefaultSettings();
            }
        },
        
        // حفظ الإعدادات
        saveSettings(settings) {
            try {
                localStorage.setItem('clinic_settings', JSON.stringify(settings));
                this.updateAllPages(settings);
                return true;
            } catch (error) {
                console.error('❌ فشل حفظ الإعدادات:', error);
                return false;
            }
        },
        
        // الإعدادات الافتراضية
        getDefaultSettings() {
            return {
                system: {
                    name: "ClinicPro",
                    version: "1.0.0",
                    initialized: false
                },
                clinic: {
                    name: "عيادة النخبة الطبية",
                    specialty: "تخصصات متعددة",
                    phone: "0112345678",
                    whatsapp: "0551234567",
                    email: "info@clinic.com",
                    address: "الرياض، المملكة العربية السعودية",
                    colors: {
                        primary: "#2D5BFF",
                        secondary: "#00C9A7",
                        accent: "#FF6B9D",
                        dark: "#1A237E",
                        light: "#F8F9FF"
                    }
                },
                doctors: [
                    {
                        id: "DR001",
                        name: "د. أحمد محمد",
                        specialty: "أسنان",
                        phone: "0551111111",
                        active: true
                    }
                ],
                booking: {
                    slotDuration: 30,
                    maxDailyBookings: 50,
                    autoConfirm: true
                },
                notifications: {
                    whatsappEnabled: true
                }
            };
        },
        
        // إدارة الحجوزات
        getBookings() {
            try {
                return JSON.parse(localStorage.getItem('clinic_bookings')) || [];
            } catch {
                return [];
            }
        },
        
        saveBooking(booking) {
            try {
                const bookings = this.getBookings();
                
                if (!booking.id) {
                    booking.id = 'BK' + Date.now();
                    booking.createdAt = new Date().toISOString();
                }
                
                bookings.push(booking);
                localStorage.setItem('clinic_bookings', JSON.stringify(bookings));
                
                // إشعار التطبيقات الأخرى
                this.notifyBookingUpdate();
                return booking.id;
            } catch (error) {
                console.error('❌ فشل حفظ الحجز:', error);
                return null;
            }
        },
        
        updateBooking(bookingId, updates) {
            try {
                const bookings = this.getBookings();
                const index = bookings.findIndex(b => b.id === bookingId);
                
                if (index !== -1) {
                    bookings[index] = { ...bookings[index], ...updates, updatedAt: new Date().toISOString() };
                    localStorage.setItem('clinic_bookings', JSON.stringify(bookings));
                    this.notifyBookingUpdate();
                    return true;
                }
                return false;
            } catch (error) {
                console.error('❌ فشل تحديث الحجز:', error);
                return false;
            }
        },
        
        // إشعار جميع الصفحات بالتحديثات
        updateAllPages(settings) {
            // تطبيق الألوان الجديدة
            this.applyThemeColors(settings?.clinic?.colors);
            
            // تحديث معلومات العيادة في جميع الصفحات
            this.updateClinicInfo(settings?.clinic);
            
            // إرسال إشعار إلى الصفحات الأخرى (إذا كانت مفتوحة)
            this.notifySettingsUpdate();
        },
        
        applyThemeColors(colors) {
            if (!colors) return;
            
            const styleId = 'clinic-dynamic-styles';
            let styleEl = document.getElementById(styleId);
            
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = styleId;
                document.head.appendChild(styleEl);
            }
            
            styleEl.textContent = `
                :root {
                    --primary: ${colors.primary};
                    --secondary: ${colors.secondary};
                    --accent: ${colors.accent};
                    --dark: ${colors.dark};
                    --light: ${colors.light};
                }
                
                .primary-bg { background-color: ${colors.primary} !important; }
                .secondary-bg { background-color: ${colors.secondary} !important; }
                .primary-text { color: ${colors.primary} !important; }
                .btn-primary { background: ${colors.primary} !important; }
                .btn-secondary { background: ${colors.secondary} !important; }
            `;
        },
        
        updateClinicInfo(clinicInfo) {
            if (!clinicInfo) return;
            
            // تحديث معلومات العيادة في جميع عناصر الصفحة
            const updateElement = (selector, value) => {
                document.querySelectorAll(selector).forEach(el => {
                    el.textContent = value;
                    if (el.tagName === 'A' && el.href.includes('tel:')) {
                        el.href = `tel:${value}`;
                    }
                });
            };
            
            if (clinicInfo.name) {
                updateElement('[data-clinic-name]', clinicInfo.name);
                updateElement('#clinicName', clinicInfo.name);
            }
            
            if (clinicInfo.phone) {
                updateElement('[data-clinic-phone]', clinicInfo.phone);
                updateElement('#clinicPhone', clinicInfo.phone);
            }
            
            if (clinicInfo.whatsapp) {
                updateElement('[data-clinic-whatsapp]', clinicInfo.whatsapp);
                updateElement('#clinicWhatsapp', clinicInfo.whatsapp);
            }
            
            if (clinicInfo.specialty) {
                updateElement('[data-clinic-specialty]', clinicInfo.specialty);
                updateElement('#clinicSpecialty', clinicInfo.specialty);
            }
        },
        
        // الإشعارات بين النوافذ
        notifySettingsUpdate() {
            if (window.updateSettings) {
                window.updateSettings(this.getSettings());
            }
            
            // إرسال رسالة إلى نافذة الأب (إذا كانت في إطار)
            try {
                if (window.parent !== window) {
                    window.parent.postMessage({
                        type: 'SETTINGS_UPDATED',
                        data: this.getSettings()
                    }, '*');
                }
            } catch (error) {
                console.log('❌ لا يمكن إرسال الإشعار للنافذة الرئيسية');
            }
        },
        
        notifyBookingUpdate() {
            if (window.updateBookings) {
                window.updateBookings(this.getBookings());
            }
        }
    };
    
    // === نظام المصادقة ===
    
    const AuthManager = {
        // التحقق من حالة تسجيل الدخول
        isLoggedIn() {
            const userData = localStorage.getItem('clinic_user');
            const loggedIn = localStorage.getItem('clinic_logged_in');
            
            if (!userData || loggedIn !== 'true') {
                return false;
            }
            
            try {
                const user = JSON.parse(userData);
                const loginTime = new Date(user.loginTime);
                const now = new Date();
                const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
                
                // انتهاء الجلسة بعد 24 ساعة
                if (hoursDiff > 24) {
                    this.logout();
                    return false;
                }
                
                return true;
            } catch {
                return false;
            }
        },
        
        // تسجيل الدخول
        login(username, password) {
            const settings = DataManager.getSettings();
            const adminUser = settings.system?.admin;
            
            if (!adminUser) {
                // إنشاء مستخدم افتراضي إذا لم يكن موجوداً
                return this.createDefaultUser(username, password);
            }
            
            if (adminUser.username === username && adminUser.password === password) {
                const userData = {
                    username: adminUser.username,
                    fullName: adminUser.fullName || 'مدير النظام',
                    role: adminUser.role || 'admin',
                    loginTime: new Date().toISOString()
                };
                
                localStorage.setItem('clinic_user', JSON.stringify(userData));
                localStorage.setItem('clinic_logged_in', 'true');
                
                // تحديث آخر دخول
                if (settings.system) {
                    settings.system.lastLogin = new Date().toISOString();
                    DataManager.saveSettings(settings);
                }
                
                return { success: true, user: userData };
            }
            
            return { success: false, error: 'بيانات الدخول غير صحيحة' };
        },
        
        // إنشاء مستخدم افتراضي
        createDefaultUser(username, password) {
            const settings = DataManager.getSettings();
            
            settings.system.admin = {
                username: username || 'admin',
                password: password || 'admin123',
                fullName: 'مدير النظام',
                role: 'admin',
                createdAt: new Date().toISOString()
            };
            
            DataManager.saveSettings(settings);
            
            const userData = {
                username: settings.system.admin.username,
                fullName: settings.system.admin.fullName,
                role: 'admin',
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('clinic_user', JSON.stringify(userData));
            localStorage.setItem('clinic_logged_in', 'true');
            
            return { success: true, user: userData, firstTime: true };
        },
        
        // تسجيل الخروج
        logout() {
            localStorage.removeItem('clinic_user');
            localStorage.removeItem('clinic_logged_in');
            window.location.href = 'index.html';
        },
        
        // تحديث واجهة المستخدم حسب حالة الدخول
        updateAuthUI() {
            const isLoggedIn = this.isLoggedIn();
            
            // إظهار/إخفاء عناصر حسب حالة الدخول
            document.querySelectorAll('[data-auth]').forEach(el => {
                const authType = el.getAttribute('data-auth');
                
                if (authType === 'logged-in') {
                    el.style.display = isLoggedIn ? '' : 'none';
                } else if (authType === 'logged-out') {
                    el.style.display = isLoggedIn ? 'none' : '';
                }
            });
            
            // تحديث اسم المستخدم
            if (isLoggedIn) {
                try {
                    const userData = JSON.parse(localStorage.getItem('clinic_user'));
                    document.querySelectorAll('[data-user-name]').forEach(el => {
                        el.textContent = userData.fullName || userData.username;
                    });
                } catch (error) {
                    console.error('❌ خطأ في تحديث واجهة المستخدم:', error);
                }
            }
        }
    };
    
    // === نظام التهيئة التلقائية ===
    
    function initializeSystem() {
        console.log('🚀 بدء تهيئة نظام ClinicPro...');
        
        // 1. التحقق من توافق المتصفح
        if (!checkBrowserCompatibility()) {
            alert('⚠️ يرجى استخدام متصفح حديث (Chrome, Firefox, Safari, Edge)');
            return false;
        }
        
        // 2. تهيئة البيانات الافتراضية إذا لزم الأمر
        const settings = DataManager.getSettings();
        
        if (!settings.system?.initialized) {
            console.log('🔄 هذا أول تشغيل للنظام، جاري التهيئة...');
            settings.system = settings.system || {};
            settings.system.initialized = true;
            settings.system.firstRun = new Date().toISOString();
            
            DataManager.saveSettings(settings);
            
            // إنشاء بيانات افتراضية
            localStorage.setItem('clinic_bookings', JSON.stringify([]));
            localStorage.setItem('clinic_patients', JSON.stringify([]));
            
            console.log('✅ تم تهيئة النظام بنجاح');
        }
        
        // 3. تطبيق الإعدادات على الصفحة
        DataManager.updateAllPages(settings);
        
        // 4. إدارة المصادقة
        const currentPage = window.location.pathname.split('/').pop();
        
        // الصفحات التي تتطلب تسجيل دخول
        const protectedPages = ['dashboard.html', 'settings.html'];
        
        if (protectedPages.includes(currentPage)) {
            if (!AuthManager.isLoggedIn()) {
                // حفظ الصفحة الحالية للعودة إليها بعد التسجيل
                localStorage.setItem('clinic_redirect', window.location.href);
                window.location.href = 'index.html';
                return false;
            }
        }
        
        // تحديث واجهة المصادقة
        AuthManager.updateAuthUI();
        
        // 5. جعل النظام متاحاً عالمياً
        window.ClinicSystem = {
            // البيانات
            getSettings: DataManager.getSettings,
            saveSettings: DataManager.saveSettings,
            getBookings: DataManager.getBookings,
            saveBooking: DataManager.saveBooking,
            updateBooking: DataManager.updateBooking,
            
            // المصادقة
            login: AuthManager.login,
            logout: AuthManager.logout,
            isLoggedIn: AuthManager.isLoggedIn,
            
            // المساعدة
            showMessage,
            formatDate,
            formatCurrency,
            
            // الإعدادات
            config: {
                version: '1.0.0',
                initialized: settings.system?.initialized || false
            }
        };
        
        // 6. إعداد الأحداث العامة
        setupGlobalEvents();
        
        console.log('✅ نظام ClinicPro جاهز للعمل!');
        return true;
    }
    
    // === وظائف المساعدة العالمية ===
    
    function showMessage(type, title, message, duration = 5000) {
        const types = {
            success: { icon: '✅', color: '#28a745' },
            error: { icon: '❌', color: '#dc3545' },
            warning: { icon: '⚠️', color: '#ffc107' },
            info: { icon: 'ℹ️', color: '#17a2b8' }
        };
        
        const config = types[type] || types.info;
        
        // إنشاء عنصر الرسالة
        const messageDiv = document.createElement('div');
        messageDiv.className = 'clinic-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            border-right: 5px solid ${config.color};
            max-width: 400px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 15px;
        `;
        
        messageDiv.innerHTML = `
            <div style="font-size: 24px;">${config.icon}</div>
            <div>
                <div style="font-weight: bold; color: #333; margin-bottom: 5px;">${title}</div>
                <div style="color: #666;">${message}</div>
            </div>
            <button style="background: none; border: none; font-size: 20px; color: #999; cursor: pointer; margin-right: auto;" onclick="this.parentElement.remove()">
                ×
            </button>
        `;
        
        document.body.appendChild(messageDiv);
        
        // إزالة تلقائية
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, duration);
        
        // إضافة الأنيميشن
        if (!document.getElementById('clinic-message-styles')) {
            const style = document.createElement('style');
            style.id = 'clinic-message-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function formatDate(dateString, format = 'medium') {
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
            })
        };
        return formats[format] || dateString;
    }
    
    function formatCurrency(amount) {
        return new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: 'SAR'
        }).format(amount);
    }
    
    // === إعداد الأحداث العالمية ===
    
    function setupGlobalEvents() {
        // حدث تسجيل الدخول
        document.addEventListener('submit', function(e) {
            const form = e.target;
            
            if (form.hasAttribute('data-login-form')) {
                e.preventDefault();
                
                const username = form.querySelector('[name="username"]')?.value;
                const password = form.querySelector('[name="password"]')?.value;
                
                if (!username || !password) {
                    showMessage('error', 'خطأ', 'يرجى إدخال جميع البيانات');
                    return;
                }
                
                const result = AuthManager.login(username, password);
                
                if (result.success) {
                    showMessage('success', 'مرحباً', 'تم تسجيل الدخول بنجاح');
                    
                    // التوجيه بعد نجاح التسجيل
                    setTimeout(() => {
                        const redirect = localStorage.getItem('clinic_redirect') || 'dashboard.html';
                        localStorage.removeItem('clinic_redirect');
                        window.location.href = redirect;
                    }, 1500);
                } else {
                    showMessage('error', 'خطأ', result.error || 'بيانات الدخول غير صحيحة');
                }
            }
        });
        
        // حدث تسجيل الخروج
        document.addEventListener('click', function(e) {
            if (e.target.closest('[data-logout]')) {
                e.preventDefault();
                if (confirm('هل تريد تسجيل الخروج؟')) {
                    AuthManager.logout();
                }
            }
        });
        
        // استقبال الرسائل من النوافذ الأخرى
        window.addEventListener('message', function(event) {
            if (event.data.type === 'SETTINGS_UPDATED') {
                DataManager.updateAllPages(event.data.data);
            }
        });
    }
    
    // === تهيئة النظام عند تحميل الصفحة ===
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSystem);
    } else {
        initializeSystem();
    }
    
    // === تصدير للاستخدام المباشر (للتوافق مع الشفرة القديمة) ===
    
    window.$showSuccess = (title, message) => showMessage('success', title, message);
    window.$showError = (title, message) => showMessage('error', title, message);
    window.$formatDate = formatDate;
    window.$formatMoney = formatCurrency;
    
})();

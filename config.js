// config.js - ملف تهيئة النظام
const ClinicConfig = {
    // إعدادات النظام الأساسية
    system: {
        name: "ClinicPro",
        version: "1.0.0",
        author: "نظام حجز العيادات",
        supportEmail: "support@clinicpro.com",
        supportPhone: "+966551234567"
    },
    
    // الإعدادات الافتراضية
    defaults: {
        // إعدادات العيادة الافتراضية
        clinic: {
            name: "عيادة النخبة الطبية",
            specialty: "تخصصات متعددة - رعاية متكاملة",
            phone: "0112345678",
            whatsapp: "0551234567",
            email: "info@clinic.com",
            address: "شارع الملك فهد، الرياض، المملكة العربية السعودية",
            logo: "assets/images/logo.png",
            colors: {
                primary: "#2D5BFF",
                secondary: "#00C9A7",
                accent: "#FF6B9D",
                dark: "#1A237E",
                light: "#F8F9FF"
            }
        },
        
        // قائمة الأطباء الافتراضية
        doctors: [
            {
                id: "DR001",
                name: "د. أحمد محمد",
                specialty: "أسنان",
                phone: "0551111111",
                email: "ahmed@clinic.com",
                availability: "9:00-17:00",
                active: true
            },
            {
                id: "DR002",
                name: "د. سارة علي",
                specialty: "باطنة",
                phone: "0552222222",
                email: "sara@clinic.com",
                availability: "9:00-17:00",
                active: true
            },
            {
                id: "DR003",
                name: "د. خالد حسن",
                specialty: "عيون",
                phone: "0553333333",
                email: "khaled@clinic.com",
                availability: "9:00-17:00",
                active: true
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
            slotDuration: 30, // دقائق
            bufferTime: 10, // دقائق بين المواعيد
            maxDailyBookings: 50,
            minBookingHours: 2, // أقل وقت للحجز المسبق
            maxBookingDays: 30, // أقصى وقت للحجز المسبق
            cancellationHours: 24, // أقل وقت للإلغاء
            allowOnlineBooking: true,
            requireDeposit: false,
            depositAmount: 50,
            autoConfirm: true,
            multipleDoctors: true
        },
        
        // إعدادات الإشعارات الافتراضية
        notifications: {
            whatsapp: {
                enabled: true,
                confirmation: true,
                reminder24h: true,
                reminder3h: false,
                followup: true
            },
            sms: {
                enabled: false,
                confirmation: false,
                reminder24h: false,
                provider: "",
                apiKey: ""
            }
        },
        
        // إعدادات الدفع الافتراضية
        payment: {
            currency: "SAR",
            requirePayment: false,
            depositAmount: 50,
            paymentMethods: ["cash", "card"],
            taxRate: 0
        }
    },
    
    // وظائف المساعدة
    helpers: {
        // تهيئة النظام عند التشغيل الأول
        initialize: function() {
            if (!localStorage.getItem('clinic_initialized')) {
                this.setupDefaultData();
                localStorage.setItem('clinic_initialized', 'true');
                console.log('✅ تم تهيئة النظام لأول مرة');
            }
        },
        
        // إعداد البيانات الافتراضية
        setupDefaultData: function() {
            // حفظ الإعدادات الافتراضية
            localStorage.setItem('clinic_settings', JSON.stringify(this.defaults));
            
            // إنشاء مصفوفة حجوزات فارغة
            localStorage.setItem('clinic_bookings', JSON.stringify([]));
            
            // إنشاء مصفوفة مرضى فارغة
            localStorage.setItem('clinic_patients', JSON.stringify([]));
            
            // إنشاء مصفوفة إحصائيات
            localStorage.setItem('clinic_stats', JSON.stringify({
                totalBookings: 0,
                totalPatients: 0,
                totalRevenue: 0,
                monthlyStats: {}
            }));
        },
        
        // تحديث الإحصائيات
        updateStats: function() {
            const bookings = JSON.parse(localStorage.getItem('clinic_bookings') || '[]');
            const patients = JSON.parse(localStorage.getItem('clinic_patients') || '[]');
            
            const stats = {
                totalBookings: bookings.length,
                totalPatients: patients.length,
                totalRevenue: this.calculateTotalRevenue(bookings),
                monthlyStats: this.calculateMonthlyStats(bookings)
            };
            
            localStorage.setItem('clinic_stats', JSON.stringify(stats));
            return stats;
        },
        
        // حساب إجمالي الإيرادات
        calculateTotalRevenue: function(bookings) {
            return bookings
                .filter(b => b.status === 'confirmed' || b.status === 'completed')
                .reduce((sum, booking) => sum + (booking.paymentAmount || 0), 0);
        },
        
        // حساب الإحصائيات الشهرية
        calculateMonthlyStats: function(bookings) {
            const monthlyStats = {};
            
            bookings.forEach(booking => {
                const date = new Date(booking.date);
                const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
                
                if (!monthlyStats[monthKey]) {
                    monthlyStats[monthKey] = {
                        bookings: 0,
                        revenue: 0,
                        patients: new Set()
                    };
                }
                
                monthlyStats[monthKey].bookings++;
                monthlyStats[monthKey].revenue += booking.paymentAmount || 0;
                monthlyStats[monthKey].patients.add(booking.phone);
            });
            
            // تحويل Set إلى عدد
            Object.keys(monthlyStats).forEach(month => {
                monthlyStats[month].patients = monthlyStats[month].patients.size;
            });
            
            return monthlyStats;
        },
        
        // توليد رقم حجز فريد
        generateBookingNumber: function() {
            const prefix = 'BK';
            const timestamp = Date.now().toString().slice(-8);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            return `${prefix}${timestamp}${random}`;
        },
        
        // توليد رقم مريض فريد
        generatePatientId: function() {
            const prefix = 'PT';
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
            return `${prefix}${timestamp}${random}`;
        },
        
        // التحقق من توفر وقت
        checkTimeAvailability: function(doctorId, date, time) {
            const bookings = JSON.parse(localStorage.getItem('clinic_bookings') || '[]');
            const settings = JSON.parse(localStorage.getItem('clinic_settings') || '{}');
            const slotDuration = settings.booking?.slotDuration || 30;
            
            // تحويل الوقت إلى دقائق
            const [hours, minutes] = time.split(':').map(Number);
            const timeInMinutes = hours * 60 + minutes;
            
            // البحث عن حجوزات متضاربة
            const conflictingBookings = bookings.filter(booking => {
                if (booking.doctor !== doctorId || booking.date !== date) {
                    return false;
                }
                
                const [bookedHours, bookedMinutes] = booking.time.split(':').map(Number);
                const bookedTimeInMinutes = bookedHours * 60 + bookedMinutes;
                
                // التحقق من التعارض
                return Math.abs(bookedTimeInMinutes - timeInMinutes) < slotDuration;
            });
            
            return conflictingBookings.length === 0;
        },
        
        // إرسال إشعار واتساب
        sendWhatsAppNotification: function(phone, message) {
            // في النظام الحقيقي، نستخدم API لإرسال واتساب
            // هذه محاكاة للوظيفة
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
            
            console.log('📱 إشعار واتساب:', {
                to: phone,
                message: message,
                url: whatsappUrl
            });
            
            // فتح نافذة جديدة لإرسال واتساب (في الإنتاج، نستخدم API)
            // window.open(whatsappUrl, '_blank');
            
            return whatsappUrl;
        },
        
        // تنسيق التاريخ العربي
        formatArabicDate: function(dateString) {
            const date = new Date(dateString);
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            return date.toLocaleDateString('ar-EG', options);
        },
        
        // تنسيق الوقت
        formatTime: function(timeString) {
            return timeString; // يمكن إضافة تنسيق إضافي هنا
        },
        
        // التحقق من صحة رقم الهاتف السعودي
        validateSaudiPhone: function(phone) {
            const saudiPhoneRegex = /^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
            return saudiPhoneRegex.test(phone.replace(/\D/g, ''));
        }
    },
    
    // ثوابت النظام
    constants: {
        bookingStatuses: {
            PENDING: 'pending',
            CONFIRMED: 'confirmed',
            COMPLETED: 'completed',
            CANCELLED: 'cancelled',
            NO_SHOW: 'no_show'
        },
        
        appointmentTypes: {
            CONSULTATION: 'استشارة',
            FOLLOW_UP: 'متابعة',
            CHECKUP: 'فحص',
            EMERGENCY: 'طوارئ',
            OTHER: 'أخرى'
        },
        
        paymentMethods: {
            CASH: 'نقدي',
            CARD: 'بطاقة',
            INSURANCE: 'تأمين',
            BANK_TRANSFER: 'تحويل بنكي'
        },
        
        paymentStatuses: {
            PENDING: 'pending',
            PAID: 'paid',
            PARTIAL: 'جزئي',
            REFUNDED: 'معاد',
            FAILED: 'فشل'
        }
    },
    
    // تهيئة تلقائية عند تحميل الملف
    init: function() {
        this.helpers.initialize();
        console.log(`🚀 ${this.system.name} v${this.system.version} جاهز`);
        return this;
    }
};

// تصدير التكوين للاستخدام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClinicConfig;
} else {
    // في المتصفح، نجعلها متاحة عالمياً
    window.ClinicConfig = ClinicConfig;
}

// التشغيل التلقائي
ClinicConfig.init();

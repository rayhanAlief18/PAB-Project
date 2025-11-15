# 💰 MoneyPlace - Personal Finance Manager

<div align="center">
  <img src="https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400" alt="MoneyPlace Logo" width="200" height="200" style="border-radius: 20px;">
  
  **Kelola Keuangan Anda dengan Bijak**
  
  [![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-54.0.10-black.svg)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
  [![Gluestack UI](https://img.shields.io/badge/Gluestack%20UI-1.1.73-purple.svg)](https://gluestack.io/)
</div>

---

## 📖 Tentang MoneyPlace

**MoneyPlace** adalah aplikasi manajemen keuangan personal yang dirancang dengan filosofi **"Simplicity meets Functionality"**. Dengan desain minimalis hitam-putih yang elegan, MoneyPlace membantu Anda mengelola pemasukan dan pengeluaran dengan mudah dan efisien.

### 🎯 Visi & Misi

**Visi:** Menjadi solusi terdepan dalam pengelolaan keuangan personal yang mudah digunakan dan dapat diandalkan.

**Misi:** 
- Memberikan pengalaman pengelolaan keuangan yang intuitif
- Membantu pengguna membuat keputusan finansial yang lebih baik
- Menyediakan insights yang berguna tentang pola pengeluaran

---

## ✨ Fitur Utama

### 💳 Dashboard Keuangan
- **Overview Saldo Real-time** - Lihat total saldo Anda dengan opsi hide/show
- **Statistik Pemasukan & Pengeluaran** - Analisis keuangan dalam bentuk visual
- **Transaksi Terbaru** - Akses cepat ke 3 transaksi terakhir

### 📊 Manajemen Transaksi
- **CRUD Operations** - Create, Read, Update, Delete transaksi secara real-time
- **Kategorisasi Otomatis** - Organisir transaksi berdasarkan kategori
- **Filter & Search** - Temukan transaksi dengan mudah
- **Hapus Transaksi** - Dengan konfirmasi untuk keamanan

### 📱 Tambah Transaksi
- **Toggle Pemasukan/Pengeluaran** - Interface yang intuitif
- **Kategori Dinamis** - Kategori yang berbeda untuk income dan expense
- **Validasi Form** - Memastikan data yang akurat
- **Format Mata Uang** - Otomatis format Rupiah Indonesia

### 👤 Profil Pengguna
- **Informasi Personal** - Kelola data profil Anda
- **Menu Pengaturan** - Akses ke berbagai fitur pengaturan
- **Keamanan** - Opsi untuk mengatur keamanan akun

---

## 🛠 Teknologi yang Digunakan

### Frontend Framework
- **React Native 0.81.4** - Framework mobile development
- **Expo 54.0.10** - Platform untuk React Native development
- **TypeScript 5.9.2** - Type-safe JavaScript

### UI/UX Library
- **Gluestack UI 1.1.73** - Modern component library
- **Lucide React Native** - Beautiful icon library
- **React Native Safe Area Context** - Handle safe areas

### Navigation & State Management
- **Expo Router 6.0.8** - File-based routing system
- **React Context API** - Global state management
- **React Hooks** - Modern React patterns

### Development Tools
- **Expo CLI** - Development and build tools
- **Metro Bundler** - JavaScript bundler
- **Babel** - JavaScript compiler

---

## 📋 Persyaratan Sistem

### Minimum Requirements
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 atau **yarn** >= 1.22.0
- **Expo CLI** >= 6.0.0

### Platform Support
- **iOS** 13.0+
- **Android** API Level 21+ (Android 5.0+)
- **Web** Modern browsers

### Development Environment
- **macOS** untuk iOS development
- **Windows/macOS/Linux** untuk Android development
- **Android Studio** atau **Xcode** (optional)

---

## 🚀 Instalasi dan Setup

### 1. Clone Repository
```bash
git clone https://github.com/username/moneyplace-app.git
cd moneyplace-app
```

### 2. Install Dependencies
```bash
# Menggunakan npm
npm install

# Atau menggunakan yarn
yarn install
```

### 3. Install Expo CLI (jika belum ada)
```bash
npm install -g @expo/cli
```

### 4. Jalankan Aplikasi
```bash
# Development mode
npm run dev

# Atau
expo start
```

### 5. Pilih Platform
Setelah server development berjalan, Anda dapat:
- **Scan QR Code** dengan Expo Go app (iOS/Android)
- **Press 'w'** untuk membuka di web browser
- **Press 'i'** untuk iOS simulator
- **Press 'a'** untuk Android emulator

---

## 📱 Panduan Penggunaan

### 🏠 Dashboard (Home Screen)

#### Fitur Utama:
1. **Header Sambutan**
   - Menampilkan nama pengguna
   - Tagline motivasi keuangan

2. **Balance Card**
   - Klik ikon mata untuk hide/show saldo
   - Saldo update real-time saat ada transaksi baru

3. **Stats Cards**
   - Card hijau: Total pemasukan
   - Card merah: Total pengeluaran
   - Update otomatis berdasarkan transaksi

4. **Transaksi Terbaru**
   - Menampilkan 3 transaksi terakhir
   - Klik "Lihat Semua" untuk ke halaman transaksi

#### Cara Penggunaan:
```
1. Buka aplikasi → Otomatis masuk ke Dashboard
2. Lihat overview keuangan Anda
3. Toggle visibility saldo dengan tap ikon mata
4. Scroll untuk melihat transaksi terbaru
```

### 💳 Halaman Transaksi

#### Fitur Utama:
1. **Header dengan Tools**
   - Tombol Search: Aktifkan pencarian
   - Tombol Filter: Tampilkan opsi filter

2. **Summary Card**
   - Total berdasarkan filter yang dipilih
   - Warna hijau (surplus) atau merah (defisit)

3. **Filter Buttons**
   - Semua: Tampilkan semua transaksi
   - Pemasukan: Hanya transaksi income
   - Pengeluaran: Hanya transaksi expense

4. **Search Functionality**
   - Cari berdasarkan judul, kategori, atau deskripsi
   - Real-time search results

5. **Transaction List**
   - Setiap item memiliki tombol hapus (ikon trash)
   - Konfirmasi sebelum menghapus

#### Cara Penggunaan:
```
1. Tap tab "Transaksi" di bottom navigation
2. Gunakan search: Tap ikon search → ketik keyword
3. Gunakan filter: Tap ikon filter → pilih kategori
4. Hapus transaksi: Tap ikon trash → konfirmasi
5. Lihat detail: Setiap transaksi menampilkan info lengkap
```

### ➕ Tambah Transaksi

#### Fitur Utama:
1. **Type Toggle**
   - Toggle hijau: Pemasukan
   - Toggle merah: Pengeluaran

2. **Form Fields**
   - Judul Transaksi (required)
   - Jumlah dengan format Rupiah (required)
   - Kategori dinamis berdasarkan tipe (required)
   - Deskripsi (optional)

3. **Kategori Dinamis**
   - **Pemasukan**: Salary, Freelance, Business, Investment, Other
   - **Pengeluaran**: Food, Transportation, Utilities, Shopping, Entertainment, Healthcare, Other

4. **Validasi Form**
   - Cek field wajib
   - Validasi jumlah > 0
   - Error handling yang informatif

#### Cara Penggunaan:
```
1. Tap tab "Tambah" di bottom navigation
2. Pilih tipe transaksi (Pemasukan/Pengeluaran)
3. Isi judul transaksi
4. Masukkan jumlah (otomatis format Rupiah)
5. Pilih kategori dari daftar yang tersedia
6. Tambahkan deskripsi (optional)
7. Tap "Simpan Transaksi"
8. Konfirmasi → Otomatis redirect ke halaman transaksi
```

### 👤 Profil Pengguna

#### Fitur Utama:
1. **User Info Card**
   - Avatar placeholder
   - Nama dan email pengguna
   - Display saldo saat ini

2. **Menu Pengaturan Akun**
   - Edit Profil
   - Keamanan
   - Notifikasi

3. **Menu Lainnya**
   - Pengaturan Aplikasi
   - Bantuan & Dukungan
   - Logout

#### Cara Penggunaan:
```
1. Tap tab "Profil" di bottom navigation
2. Lihat informasi profil Anda
3. Tap menu yang diinginkan
4. Untuk logout: Tap "Keluar" → Konfirmasi
```

---

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary-bg: #FFFFFF      /* Background utama */
--primary-text: #000000    /* Text utama */
--card-bg: #000000         /* Background card */
--card-text: #FFFFFF       /* Text di card */

/* Accent Colors */
--income-color: #00FF00    /* Warna pemasukan */
--expense-color: #FF0000   /* Warna pengeluaran */
--secondary-text: #666666  /* Text sekunder */
--border-color: #333333    /* Border card */
```

### Typography
```css
/* Font Sizes */
--heading-xl: 28px         /* Balance amount */
--heading-lg: 24px         /* Page titles */
--heading-md: 20px         /* User name */
--heading-sm: 18px         /* Section titles */
--body-lg: 16px            /* Transaction titles */
--body-md: 14px            /* Labels, buttons */
--body-sm: 12px            /* Subtitles, dates */

/* Font Weights */
--weight-bold: 700         /* Headings, amounts */
--weight-medium: 500       /* Labels, buttons */
--weight-regular: 400      /* Body text */
```

### Spacing System
```css
/* Spacing Scale (8px base) */
--space-xs: 4px
--space-sm: 8px
--space-md: 12px
--space-lg: 16px
--space-xl: 20px
--space-2xl: 24px
```

---

## 🏗 Struktur Project

```
moneyplace-app/
├── app/                         # Expo Router pages
│   ├── (tabs)/                  # Tab navigation group
│   │   ├── _layout.tsx          # Tab layout configuration
│   │   ├── index.tsx            # Dashboard screen
│   │   ├── transactions.tsx     # Transactions list screen
│   │   ├── add-transaction.tsx  # Add transaction form
│   │   └── profile.tsx          # Profile screen
│   ├── _layout.tsx              # Root layout
│   └── +not-found.tsx           # 404 page
├── components/                  # Reusable components
│   ├── BalanceCard.tsx          # Balance display component
│   ├── StatsCard.tsx            # Statistics card component
│   └── TransactionItem.tsx      # Transaction list item
├── contexts/                    # React Context providers
│   └── TransactionContext.tsx   # Global state management
├── types/                       # TypeScript type definitions
│   └── transaction.ts           # Transaction and User types
├── hooks/                       # Custom React hooks
│   └── useFrameworkReady.ts     # Framework ready hook
├── assets/                      # Static assets
│   └── images/                  # Image assets
├── app.json                     # Expo configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

---

## 🔧 Konfigurasi

### Expo Configuration (app.json)
```json
{
  "expo": {
    "name": "MoneyPlace",
    "slug": "moneyplace-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": ["ios", "android", "web"],
    "userInterfaceStyle": "automatic"
  }
}
```

### TypeScript Configuration
- Strict mode enabled
- Path mapping untuk imports
- Type checking untuk semua files

### Development Scripts
```json
{
  "dev": "expo start",
  "build:web": "expo export --platform web",
  "lint": "expo lint",
  "typecheck": "tsc --noEmit"
}
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Dashboard Testing
- [ ] Saldo tampil dengan benar
- [ ] Toggle visibility saldo berfungsi
- [ ] Stats cards menampilkan data akurat
- [ ] Transaksi terbaru ter-update real-time

#### Transaction Management
- [ ] Filter berfungsi (all/income/expense)
- [ ] Search berfungsi dengan keyword
- [ ] Delete transaksi dengan konfirmasi
- [ ] Saldo update saat hapus transaksi

#### Add Transaction
- [ ] Toggle income/expense berfungsi
- [ ] Validasi form bekerja
- [ ] Format currency otomatis
- [ ] Kategori berubah sesuai tipe
- [ ] Transaksi tersimpan dan redirect

#### Profile
- [ ] Informasi user tampil benar
- [ ] Menu items dapat diklik
- [ ] Logout dengan konfirmasi

### Device Testing
- [ ] iOS (iPhone 12+)
- [ ] Android (API 21+)
- [ ] Web browser
- [ ] Tablet landscape/portrait

---

## 🚀 Deployment

### Build untuk Production

#### Android APK
```bash
# Build APK
expo build:android

# Atau menggunakan EAS Build
eas build --platform android
```

#### iOS App
```bash
# Build untuk iOS
expo build:ios

# Atau menggunakan EAS Build
eas build --platform ios
```

#### Web Deployment
```bash
# Export untuk web
expo export --platform web

# Deploy ke hosting (Netlify, Vercel, dll)
```

### Environment Variables
```bash
# .env file
EXPO_PUBLIC_API_URL=your_api_url
EXPO_PUBLIC_APP_VERSION=1.0.0
```

---

## 🤝 Contributing

### Development Workflow
1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Style Guidelines
- Gunakan TypeScript untuk type safety
- Follow React Native best practices
- Gunakan functional components dengan hooks
- Implement proper error handling
- Write descriptive commit messages

### Pull Request Process
1. Update README.md jika diperlukan
2. Pastikan semua tests pass
3. Request review dari maintainers
4. Merge setelah approval

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Support & Contact

### Developer Information
- **Developer**: Tim MoneyPlace
- **Email**: support@moneyplace.app
- **Website**: https://moneyplace.app

### Support Channels
- **GitHub Issues**: [Report bugs](https://github.com/username/moneyplace-app/issues)
- **Documentation**: [Wiki](https://github.com/username/moneyplace-app/wiki)
- **Community**: [Discussions](https://github.com/username/moneyplace-app/discussions)

### Social Media
- **Twitter**: [@MoneyPlaceApp](https://twitter.com/moneyplaceapp)
- **LinkedIn**: [MoneyPlace](https://linkedin.com/company/moneyplace)
- **Instagram**: [@moneyplace.app](https://instagram.com/moneyplace.app)

---

## 🙏 Acknowledgments

- **React Native Team** - Framework yang luar biasa
- **Expo Team** - Platform development yang memudahkan
- **Gluestack UI** - Component library yang elegant
- **Lucide Icons** - Beautiful icon set
- **Community Contributors** - Terima kasih atas kontribusinya

---

## 📈 Roadmap

### Version 1.1.0 (Coming Soon)
- [ ] Dark mode support
- [ ] Export data to CSV/PDF
- [ ] Budget planning feature
- [ ] Recurring transactions
- [ ] Multi-currency support

### Version 1.2.0 (Future)
- [ ] Cloud sync
- [ ] Expense analytics & insights
- [ ] Bill reminders
- [ ] Category customization
- [ ] Backup & restore

### Version 2.0.0 (Long-term)
- [ ] Multi-user support
- [ ] Bank account integration
- [ ] Investment tracking
- [ ] Financial goals
- [ ] AI-powered insights

---

<div align="center">
  <p><strong>Made with ❤️ by Refangga Lintar Prayoga</strong></p>
  <p>© 2025 MoneyPlace. All rights reserved.</p>
</div>
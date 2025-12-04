# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```
Iconscribe-
├─ .env.development
├─ .vite
│  └─ deps
│     ├─ chunk-D2KY6O3O.js
│     ├─ chunk-D2KY6O3O.js.map
│     ├─ chunk-QFLFZMJ5.js
│     ├─ chunk-QFLFZMJ5.js.map
│     ├─ chunk-V4OQ3NZ2.js
│     ├─ chunk-V4OQ3NZ2.js.map
│     ├─ chunk-XE2STDAP.js
│     ├─ chunk-XE2STDAP.js.map
│     ├─ chunk-ZZ2ML26O.js
│     ├─ chunk-ZZ2ML26O.js.map
│     ├─ framer-motion.js
│     ├─ framer-motion.js.map
│     ├─ lucide-react.js
│     ├─ lucide-react.js.map
│     ├─ package.json
│     ├─ react-apexcharts.js
│     ├─ react-apexcharts.js.map
│     ├─ react-dom_client.js
│     ├─ react-dom_client.js.map
│     ├─ react-icons_fa.js
│     ├─ react-icons_fa.js.map
│     ├─ react-icons_md.js
│     ├─ react-icons_md.js.map
│     ├─ react-router-dom.js
│     ├─ react-router-dom.js.map
│     ├─ react.js
│     ├─ react.js.map
│     ├─ swiper_modules.js
│     ├─ swiper_modules.js.map
│     ├─ swiper_react.js
│     ├─ swiper_react.js.map
│     └─ _metadata.json
├─ backend
│  ├─ .env
│  ├─ backups
│  │  ├─ backup-2025-11-15T12-52-32-698Z.sql
│  │  ├─ backup-2025-11-15T12-56-59-054Z.sql
│  │  ├─ backup-2025-11-15T13-09-19-892Z.sql
│  │  ├─ backup-iconscribe-2025-11-15.sql
│  │  └─ backup-iconscribe-2025-11-17.sql
│  ├─ iconscribe-backup.sql
│  ├─ middleware
│  │  ├─ authMiddleware.js
│  │  └─ uploadProduct.js
│  ├─ models
│  │  ├─ Conversation.js
│  │  ├─ db.js
│  │  └─ Message.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ backupRoutes.js
│  │  ├─ chatRoutes.js
│  │  ├─ maintenanceRoutes.js
│  │  ├─ orderRoutes.js
│  │  ├─ otpRoutes.js
│  │  ├─ productAttributesRoutes.js
│  │  ├─ products.js
│  │  ├─ salesRoutes.js
│  │  ├─ sessionRoutes.js
│  │  ├─ supplyRoutes.js
│  │  └─ userRoutes.js
│  ├─ server.js
│  ├─ uploads
│  │  ├─ 1760016164517.png
│  │  ├─ 1760064120676.png
│  │  ├─ 1760064785961.png
│  │  ├─ 1760067855358.png
│  │  ├─ 1760067970582.png
│  │  ├─ 1760068514694.png
│  │  ├─ orderfiles
│  │  │  ├─ 1760506735489.png
│  │  │  ├─ 1760506827326.png
│  │  │  ├─ 1760507131234.png
│  │  │  ├─ 1760507180539.png
│  │  │  ├─ 1760507236234.png
│  │  │  ├─ 1760507236237.png
│  │  │  ├─ 1760507383667.png
│  │  │  ├─ 1760507483215.png
│  │  │  ├─ 1760507701948.png
│  │  │  ├─ 1760507766804.pdf
│  │  │  ├─ 1760508509001.png
│  │  │  ├─ 1760509465298.png
│  │  │  ├─ 1760509726967.png
│  │  │  ├─ 1760509763758.png
│  │  │  ├─ 1760509805716.png
│  │  │  ├─ 1760509830855.png
│  │  │  ├─ 1760511107873.png
│  │  │  ├─ 1760512112422.png
│  │  │  ├─ 1760512275432.png
│  │  │  ├─ 1760512275443.png
│  │  │  ├─ 1760512550750.docx
│  │  │  ├─ 1760512575038.pdf
│  │  │  ├─ 1762838640897.png
│  │  │  ├─ 1762866696627.png
│  │  │  ├─ 1762951858091.png
│  │  │  ├─ 1762952224510.png
│  │  │  ├─ 1763041554755.png
│  │  │  ├─ 1763043292180.png
│  │  │  ├─ 1763044225993.png
│  │  │  ├─ 1763128381678.png
│  │  │  ├─ 1763207183206.png
│  │  │  ├─ 1763285402874.png
│  │  │  ├─ 1763367148343.png
│  │  │  ├─ 1763369299129.png
│  │  │  ├─ 1763373074673.png
│  │  │  ├─ 1763373074684.png
│  │  │  ├─ 1763373435218.png
│  │  │  ├─ 1763377687480.png
│  │  │  ├─ 1763434060727.png
│  │  │  ├─ 1763448468061.png
│  │  │  ├─ 1763476263991.png
│  │  │  ├─ 1763504921377.png
│  │  │  ├─ 1763506167892.png
│  │  │  ├─ 1763508250478.png
│  │  │  ├─ 1763508251853.png
│  │  │  ├─ 1763508256710.png
│  │  │  ├─ 1763511250825.png
│  │  │  ├─ 1763514090841.png
│  │  │  ├─ 1763514277953.png
│  │  │  ├─ 1763514447769.png
│  │  │  ├─ 1763514620698.png
│  │  │  ├─ 1763514747047.png
│  │  │  ├─ 1763518652734.png
│  │  │  ├─ 1763518702030.png
│  │  │  ├─ 1763519081593.png
│  │  │  ├─ 1763525721509.png
│  │  │  ├─ 1763526649125.png
│  │  │  ├─ 1763527103615.png
│  │  │  ├─ 1763528265525.png
│  │  │  ├─ 1763528471594.png
│  │  │  ├─ 1763528694349.png
│  │  │  ├─ 1763528819498.png
│  │  │  ├─ 1763534746870.png
│  │  │  ├─ 1764144181133.png
│  │  │  ├─ 1764150504492.png
│  │  │  ├─ 1764164459902.png
│  │  │  ├─ 1764343098525.png
│  │  │  ├─ 1764347104268.pdf
│  │  │  ├─ 1764418593935.png
│  │  │  ├─ 1764422903529.png
│  │  │  ├─ 1764427477235.png
│  │  │  ├─ 1764487788070.png
│  │  │  ├─ 1764489415371.png
│  │  │  ├─ 1764489421525.png
│  │  │  ├─ 1764492028059.png
│  │  │  ├─ 1764492052555.png
│  │  │  ├─ 1764493256848.png
│  │  │  ├─ 1764493265981.png
│  │  │  ├─ 1764495014616.png
│  │  │  ├─ 1764495037054.png
│  │  │  ├─ 1764495171447.png
│  │  │  └─ 1764495419395.pdf
│  │  └─ products
│  │     ├─ 1764085569030-Binding.png
│  │     ├─ 1764085633429-Book.png
│  │     ├─ 1764085695019-Brochure.png
│  │     ├─ 1764085738706-ID.png
│  │     ├─ 1764124257051-calendar.png
│  │     ├─ 1764124327116-CallingCard.png
│  │     ├─ 1764124429945-Posters.png
│  │     ├─ 1764124752467-Invitation.png
│  │     ├─ 1764126792975-atp.png
│  │     ├─ 1764126822877-Flyers.png
│  │     ├─ 1764136058549-Label.png
│  │     ├─ 1764136064727-RaffleTicket.png
│  │     ├─ 1764136111336-ID.png
│  │     └─ 1764214236506-ID.png
│  └─ utils
│     └─ sendEmail.js
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ templates
│     ├─ brochure
│     │  ├─ brochure1.png
│     │  ├─ brochure2.png
│     │  ├─ brochure3.png
│     │  └─ brochure4.png
│     ├─ business-card
│     │  ├─ business-card1.png
│     │  ├─ business-card2.png
│     │  ├─ business-card3.png
│     │  ├─ business-card4.png
│     │  └─ business-card5.png
│     ├─ calendar
│     │  ├─ calendar1.png
│     │  ├─ calendar2.png
│     │  ├─ calendar3.png
│     │  └─ calendar4.png
│     ├─ icons
│     │  └─ ICONS.png
│     ├─ invitation
│     │  ├─ invitation1.png
│     │  ├─ invitation2.png
│     │  └─ invitation3.png
│     ├─ json
│     │  ├─ brochure
│     │  │  ├─ brochure1.json
│     │  │  ├─ brochure2.json
│     │  │  ├─ brochure3.json
│     │  │  └─ brochure4.json
│     │  ├─ business-card
│     │  │  ├─ business-card1.json
│     │  │  ├─ business-card2.json
│     │  │  ├─ business-card3.json
│     │  │  ├─ business-card4.json
│     │  │  └─ business-card5.json
│     │  ├─ calendar
│     │  │  ├─ calendar1.json
│     │  │  └─ calendar2.json
│     │  ├─ label
│     │  │  ├─ label1.json
│     │  │  ├─ label2.json
│     │  │  └─ label3.json
│     │  └─ poster
│     │     ├─ poster1.json
│     │     └─ poster2.json
│     ├─ label
│     │  ├─ label1.png
│     │  ├─ label2.png
│     │  └─ label3.png
│     └─ poster
│        ├─ poster1.png
│        ├─ poster2.png
│        ├─ poster3.png
│        ├─ poster4.png
│        └─ poster5.png
├─ README.md
├─ src
│  ├─ api.js
│  ├─ App.css
│  ├─ assets
│  │  ├─ atp.png
│  │  ├─ Binding.png
│  │  ├─ Book.png
│  │  ├─ Brochure.png
│  │  ├─ BusinessCard.png
│  │  ├─ calendar.png
│  │  ├─ CallingCard.png
│  │  ├─ decorations
│  │  ├─ default_product.png
│  │  ├─ DocumentP.png
│  │  ├─ facebook-logo.png
│  │  ├─ fb.png
│  │  ├─ Flyers.png
│  │  ├─ form.png
│  │  ├─ google-logo.png
│  │  ├─ ICONS.png
│  │  ├─ ID.png
│  │  ├─ insta.png
│  │  ├─ Invitation.png
│  │  ├─ Label.png
│  │  ├─ mail.png
│  │  ├─ NewsLetter.png
│  │  ├─ org.jpg
│  │  ├─ Phone.png
│  │  ├─ Posters.png
│  │  ├─ RaffleTicket.png
│  │  └─ yearbook.png
│  ├─ component
│  │  ├─ Aboutus.jsx
│  │  ├─ admin
│  │  │  ├─ AdminPage.jsx
│  │  │  ├─ BackupRestoreSection.jsx
│  │  │  ├─ Maintenance.jsx
│  │  │  ├─ ManageUserSection.jsx
│  │  │  ├─ Navigation.jsx
│  │  │  ├─ OverviewSection.jsx
│  │  │  └─ SalesExpenseSection.jsx
│  │  ├─ AspectRatioSelector.jsx
│  │  ├─ ChatWidget.jsx
│  │  ├─ ContactUs.jsx
│  │  ├─ editor
│  │  │  ├─ CanvasWorkspace.jsx
│  │  │  ├─ Element.jsx
│  │  │  ├─ ElementsPanel.jsx
│  │  │  ├─ ImageElement.jsx
│  │  │  ├─ LayersPanel.jsx
│  │  │  ├─ PropertiesPanel.jsx
│  │  │  ├─ ShapeElement.jsx
│  │  │  ├─ TextElement.jsx
│  │  │  ├─ Toolbar.jsx
│  │  │  └─ TransformBox.jsx
│  │  ├─ footer.jsx
│  │  ├─ Hero.jsx
│  │  ├─ Login.jsx
│  │  ├─ login_signup_Page.jsx
│  │  ├─ MaintenanceUser.jsx
│  │  ├─ manager
│  │  │  ├─ ArchiveSection.jsx
│  │  │  ├─ ManagerChatPanel.jsx
│  │  │  ├─ ManagerPage.jsx
│  │  │  ├─ Navigation.jsx
│  │  │  ├─ OrdersSection.jsx
│  │  │  ├─ OverviewSection.jsx
│  │  │  ├─ ProductSection.jsx
│  │  │  ├─ SalesAndExpenseSection.jsx
│  │  │  ├─ SupplySection.jsx
│  │  │  └─ WalkInOrderModal.jsx
│  │  ├─ navigation.jsx
│  │  ├─ ProductSection.jsx
│  │  ├─ Profile.jsx
│  │  ├─ ProtectedRoute.jsx
│  │  ├─ Signup.jsx
│  │  ├─ TemplateGallery.jsx
│  │  ├─ Transactions.jsx
│  │  ├─ ui
│  │  │  ├─ Button.jsx
│  │  │  ├─ ColorPicker.jsx
│  │  │  ├─ IconButton.jsx
│  │  │  └─ ToastProvider.jsx
│  │  ├─ Unauthorized.jsx
│  │  └─ UploadSection.jsx
│  ├─ context
│  │  ├─ authContext.jsx
│  │  └─ EditorContext.jsx
│  ├─ data
│  │  └─ templates.json
│  ├─ index.css
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ EditorPage.jsx
│  │  ├─ ForgotPassword.jsx
│  │  ├─ ProductView.jsx
│  │  └─ ResetPassword.jsx
│  ├─ products
│  │  ├─ Binding.jsx
│  │  ├─ Books.jsx
│  │  ├─ Brochure.jsx
│  │  ├─ Calendars.jsx
│  │  ├─ CallingCard.jsx
│  │  ├─ Flyers.jsx
│  │  ├─ Invitation.jsx
│  │  ├─ Label.jsx
│  │  ├─ NewsLetter.jsx
│  │  ├─ OfficialReceipt.jsx
│  │  ├─ Posters.jsx
│  │  └─ RaffleTicket.jsx
│  ├─ Splash.jsx
│  ├─ Userpage.jsx
│  └─ utils
│     ├─ bookQuotation.js
│     ├─ computeBindingQuotation.js
│     ├─ computeCalendarQuotation.js
│     ├─ computeORQuotation.js
│     ├─ computeQuotation.js
│     ├─ elementUtils.js
│     └─ exportUtils.js
└─ vite.config.js

```
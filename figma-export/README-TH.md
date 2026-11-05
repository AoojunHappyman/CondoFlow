# CondoFlow — ชุดหน้าจอสำหรับ Figma

รวม 56 หน้าจอ Desktop กว้าง 1440 px จากหน้าจอจริงของโปรเจกต์ ครบทั้ง 30 page components และมุมมอง 4 บทบาท

## วิธีนำเข้าแบบแก้ไขข้อความได้ (แนะนำ)

1. แตกไฟล์ ZIP แล้วเปิด Figma Desktop
2. เปิดไฟล์ Design ที่ต้องการ หรือไฟล์ https://www.figma.com/design/PbTSUXo7q5q2zOwOO9DIxV
3. ไปที่ Plugins → Development → Import plugin from manifest…
4. เลือก importer/manifest.json ในชุดนี้
5. รัน CondoFlow — Import All Screens แล้วเลือก CondoFlow-all-screens.json
6. รอจนขึ้นว่าเสร็จแล้ว 56 หน้าจอ ปลั๊กอินจะสร้างหน้าใหม่ชื่อ CondoFlow — All Screens

ใช้ฟอนต์ IBM Plex Sans Thai และ Prompt หากไม่มีให้ติดตั้งจาก Google Fonts แล้วรันปลั๊กอินใหม่ หากใช้ฟอนต์สำรอง ปลั๊กอินจะแจ้งชื่อฟอนต์ที่ไม่พบ
ปลั๊กอินอ่านเฉพาะไฟล์ที่เลือก ไม่เชื่อมต่อเครือข่าย รูปภาพที่โหลดได้ถูกฝังในไฟล์แล้ว

## วิธีนำเข้า SVG อย่างรวดเร็ว

ลากไฟล์ .svg จากโฟลเดอร์ screens เข้า Figma ได้โดยตรง ตัวนำเข้าแบบปลั๊กอินข้างต้นเหมาะกว่าหากต้องแก้ไขข้อความ
เปิด Preview.html เพื่อดูหน้าทั้งหมดก่อนนำเข้า

## ขอบเขตและข้อจำกัด

ส่งออกหน้าจอหลักและมุมมองตามบทบาทในธีมสว่าง ไม่รวมทุกสถานะป๊อปอัป ฟอร์มที่เปิดหลังคลิก แท็บย่อย โหมดมืด และหน้าจอมือถือ
ไฟล์ Figma ที่สร้างไว้ยังไม่มีหน้าจอ เนื่องจากบัญชี Starter ถึงขีดจำกัดเครื่องมือ MCP ต้องนำเข้าชุดนี้ด้วยวิธีข้างต้น
ชุดนี้สร้างจากข้อมูลตัวอย่างของโปรเจกต์ รูปที่ URL ต้นฉบับโหลดไม่ได้จะไม่มีภาพในตัวนำเข้า
การนำเข้าผ่านปลั๊กอินยังไม่ได้ทดสอบใน Figma จริง เนื่องจากข้อจำกัดบัญชี จัดตำแหน่งตามหน้าจอเว็บจริง ไอคอนและกราฟเป็นเวกเตอร์ ข้อความหลักเป็น Text layer

## รายชื่อหน้าจอ

- 01-admin-login — /login
- 02-admin-register — /register
- 03-admin-forgot-password — /forgot-password
- 04-admin-dashboard — /admin/dashboard
- 05-admin-system-coverage — /admin/system-coverage
- 06-admin-units — /admin/units
- 07-admin-owners-tenants — /admin/owners-tenants
- 08-admin-contracts — /admin/contracts
- 09-admin-invoices — /admin/invoices
- 10-admin-payments — /admin/payments
- 11-admin-repairs — /admin/repairs
- 12-admin-parcels — /admin/parcels
- 13-admin-announcements — /admin/announcements
- 14-admin-reports — /admin/reports
- 15-admin-roles — /admin/roles
- 16-admin-audit-log — /admin/audit-log
- 17-admin-settings — /admin/settings
- 18-admin-unit-detail — /units/unit-a-1205
- 19-admin-profile — /profile
- 20-admin-notifications — /notifications
- 21-admin-history — /history
- 22-admin-team — /team
- 23-owner-dashboard — /dashboard
- 24-owner-units — /owner/units
- 25-owner-unit-detail — /units/unit-a-1205
- 26-owner-contracts — /owner/contracts
- 27-owner-invoices — /owner/expenses
- 28-owner-parcels — /parcels
- 29-owner-repairs — /maintenance
- 30-owner-announcements — /announcements
- 31-owner-history — /history
- 32-owner-profile — /profile
- 33-owner-notifications — /notifications
- 34-tenant-dashboard — /dashboard
- 35-tenant-units — /units
- 36-tenant-unit-detail — /units/unit-a-1205
- 37-tenant-contracts — /contracts
- 38-tenant-invoices — /invoices
- 39-tenant-parcels — /parcels
- 40-tenant-repairs — /maintenance
- 41-tenant-announcements — /announcements
- 42-tenant-history — /history
- 43-tenant-profile — /profile
- 44-tenant-notifications — /notifications
- 45-user-dashboard — /dashboard
- 46-user-units — /units
- 47-user-unit-detail — /units/unit-a-1205
- 48-user-repairs — /maintenance
- 49-user-announcements — /announcements
- 50-user-history — /history
- 51-user-profile — /profile
- 52-user-notifications — /notifications
- 53-admin-error-403 — /error/403
- 54-admin-error-404 — /error/404
- 55-admin-error-500 — /error/500
- 56-tenant-system-maintenance — /dashboard
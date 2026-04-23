"use client";
import { useState, useEffect } from "react";

// لیست ولایات افغانستان برای کادر انتخابی
const provinces = ["کابل", "هرات", "بلخ", "قندهار", "ننگرهار", "پکتیا", "خوست", "غزنی", "لغمان", "بامیان", "بدخشان", "تخار", "کندز", "فاریاب", "جوزجان", "سرپل", "غور", "دایکندی", "اروزگان", "زابل", "نیمروز", "هلمند", "فراه", "بادغیس", "پنجشیر", "کاپیسا", "لوگر", "میدان وردک", "پروان", "کنر", "نورستان", "سمنگان", "بغلان", "پکتیکا"];

// نسبت‌های پایواز
const relations = ["برادر", "پدر", "خواهر", "شوهر", "همسر", "کاکا", "ماما", "خسر", "خسربوره", "پسر کاکا", "پسرعمه", "پسر ماما", "پسرخاله", "دوست", "خواهر زاده", "برادر زاده"];

export default function NabilClinicPro() {
  const [activeTab, setActiveTab] = useState("register");
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // فرم جامع اطلاعات
  const [form, setForm] = useState({
    name: "", fatherName: "", lastName: "", age: "", province: "کابل", phone: "", visitDate: "", nextVisit: "",
    attendantName: "", attendantPhone: "", relation: "پدر",
    bp: "", pulse: "", ox: "", temp: "",
    serviceType: "", servicePrice: 0, labCost: 0, otherCosts: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem("nabil_pro_db");
    if (saved) setPatients(JSON.parse(saved));
  }, []);

  const savePatient = () => {
    const totalIncome = Number(form.servicePrice);
    const expenses = Number(form.labCost) + Number(form.otherCosts);
    const netProfit = totalIncome - expenses;
    const ownerShare = netProfit * 0.25;
    const doctorsSplit = (netProfit - ownerShare) / 2;

    const newPatient = {
      ...form,
      id: Date.now(),
      ownerShare,
      drNabilShare: doctorsSplit,
      drMahfouzShare: doctorsSplit,
      netProfit
    };

    const updated = [newPatient, ...patients];
    setPatients(updated);
    localStorage.setItem("nabil_pro_db", JSON.stringify(updated));
    alert("مشخصات با موفقیت ثبت شد");
    setActiveTab("list");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-right text-slate-800 font-sans" dir="rtl">
      {/* منوی کناری */}
      <aside className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl p-6 hidden md:block">
        <h2 className="text-xl font-black text-blue-800 mb-8">مدیریت آکادمی نابل</h2>
        <nav className="space-y-3">
          <button onClick={() => setActiveTab("register")} className={`w-full p-3 rounded-xl font-bold ${activeTab === 'register' ? 'bg-blue-600 text-white' : 'bg-slate-50'}`}>ثبت بیمار جدید</button>
          <button onClick={() => setActiveTab("list")} className={`w-full p-3 rounded-xl font-bold ${activeTab === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-50'}`}>لیست مریضان</button>
          <button onClick={() => setActiveTab("nextVisits")} className={`w-full p-3 rounded-xl font-bold ${activeTab === 'nextVisits' ? 'bg-blue-600 text-white' : 'bg-slate-50'}`}>نوبت‌های بعدی</button>
        </nav>
      </aside>

      <main className="md:mr-64 p-8">
        {activeTab === "register" && (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-black mb-6 border-b pb-4">۱. مشخصات عمومی و پایواز</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <input placeholder="نام" className="p-3 bg-slate-50 rounded-lg border" onChange={e => setForm({...form, name: e.target.value})} />
              <input placeholder="نام پدر" className="p-3 bg-slate-50 rounded-lg border" onChange={e => setForm({...form, fatherName: e.target.value})} />
              <input placeholder="تخلص" className="p-3 bg-slate-50 rounded-lg border" onChange={e => setForm({...form, lastName: e.target.value})} />
              <input placeholder="سن" type="number" className="p-3 bg-slate-50 rounded-lg border" onChange={e => setForm({...form, age: e.target.value})} />
              <select className="p-3 bg-slate-50 rounded-lg border" onChange={e => setForm({...form, province: e.target.value})}>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input placeholder="شماره تماس" className="p-3 bg-slate-50 rounded-lg border" onChange={e => setForm({...form, phone: e.target.value})} />
              <input placeholder="تاریخ مراجعه" type="date" className="p-3 bg-slate-50 rounded-lg border" onChange={e => setForm({...form, visitDate: e.target.value})} />
              <input placeholder="تاریخ نوبت بعدی" type="date" className="p-3 bg-slate-50 rounded-lg border" onChange={e => setForm({...form, nextVisit: e.target.value})} />
            </div>

            <h3 className="text-xl font-black mb-6 border-b pb-4">۲. خدمات و محاسبات مالی</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block font-bold">هزینه درمان (افغانی):</label>
                <input type="number" className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-xl font-black text-2xl" placeholder="مثلاً 4000" onChange={e => setForm({...form, servicePrice: Number(e.target.value)})} />
                <p className="text-xs text-slate-400 italic">قیمت‌ها را طبق لیست (مثلاً ریشه: 1000، بلیچینگ: 4000) وارد کنید.</p>
              </div>
              <div className="space-y-4">
                <label className="block font-bold">مصارف (لابراتوار + مواد + نان):</label>
                <div className="flex gap-2">
                   <input placeholder="لابراتوار" type="number" className="w-1/2 p-3 bg-red-50 rounded-lg border" onChange={e => setForm({...form, labCost: Number(e.target.value)})} />
                   <input placeholder="سایر مصارف" type="number" className="w-1/2 p-3 bg-red-50 rounded-lg border" onChange={e => setForm({...form, otherCosts: Number(e.target.value)})} />
                </div>
              </div>
            </div>

            <button onClick={savePatient} className="w-full mt-10 bg-green-600 text-white py-4 rounded-2xl font-black text-xl shadow-lg hover:bg-green-700 transition">ذخیره پرونده و محاسبه سهم اساتید</button>
          </div>
        )}

        {activeTab === "list" && (
          <div>
            <input placeholder="جستجو بر اساس نام، آیدی یا تماس..." className="w-full p-4 rounded-2xl mb-6 shadow-sm border-none outline-none focus:ring-2 ring-blue-500" onChange={e => setSearchTerm(e.target.value)} />
            <div className="grid gap-4">
              {patients.filter(p => p.name.includes(searchTerm)).map(p => (
                <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap justify-between items-center">
                  <div>
                    <h4 className="font-black text-lg">{p.name} {p.lastName}</h4>
                    <p className="text-sm text-blue-600 font-bold">{p.phone} | ولایت: {p.province}</p>
                    <p className="text-xs text-slate-400 mt-1">نوبت بعدی: {p.nextVisit}</p>
                  </div>
                  <div className="text-left bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-500 font-bold">سهم دکتر نابل: <span className="text-green-600">{p.drNabilShare.toLocaleString()}</span></p>
                    <p className="text-xs text-slate-500 font-bold">سهم دکتر محفوظ: <span className="text-green-600">{p.drMahfouzShare.toLocaleString()}</span></p>
                    <p className="text-xs text-red-400 font-bold">سهم مالک (۲۵٪): {p.ownerShare.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm">🖨 چاپ نسخه</button>
                    <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-sm">📱 واتساپ</button>
                    <button onClick={() => {
                        const filtered = patients.filter(item => item.id !== p.id);
                        setPatients(filtered);
                        localStorage.setItem("nabil_pro_db", JSON.stringify(filtered));
                    }} className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold text-sm">حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "nextVisits" && (
           <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-black mb-6">جدول مریضان نوبت بعدی</h3>
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="p-4 border-b">نام مریض</th>
                    <th className="p-4 border-b">شماره تماس</th>
                    <th className="p-4 border-b">تاریخ نوبت بعدی</th>
                    <th className="p-4 border-b">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.filter(p => p.nextVisit).map(p => (
                    <tr key={p.id}>
                      <td className="p-4 border-b font-bold">{p.name}</td>
                      <td className="p-4 border-b text-blue-600 font-bold">{p.phone}</td>
                      <td className="p-4 border-b font-black text-red-500">{p.nextVisit}</td>
                      <td className="p-4 border-b">
                        <a href={`https://wa.me/${p.phone}?text=سلام ${p.name} عزیز، نوبت بعدی شما در آکادمی نابل بتاریخ ${p.nextVisit} میباشد.`} target="_blank" className="bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold">ارسال پیامک واتساپ</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        )}
      </main>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";

const provinces = ["کابل", "هرات", "بلخ", "قندهار", "ننگرهار", "پکتیا", "خوست", "غزنی", "لغمان", "بامیان", "بدخشان", "تخار", "کندز", "فاریاب", "جوزجان", "سرپل", "غور", "دایکندی", "اروزگان", "زابل", "نیمروز", "هلمند", "فراه", "بادغیس", "پنجشیر", "کاپیسا", "لوگر", "میدان وردک", "پروان", "کنر", "نورستان", "سمنگان", "بغلان", "پکتیکا"];

const relations = ["برادر", "پدر", "خواهر", "شوهر", "همسر", "کاکا", "ماما", "خسر", "خسربوره", "پسر کاکا", "پسرعمه", "پسر ماما", "پسرخاله", "دوست", "خواهر زاده", "برادر زاده"];

export default function NabilAcademy() {
  const [activeTab, setActiveTab] = useState("register");
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    name: "", fatherName: "", lastName: "", age: "", province: "کابل", phone: "", visitDate: "", nextVisit: "",
    attendantName: "", attendantPhone: "", relation: "پدر",
    bp: "", pulse: "", ox: "", temp: "",
    serviceType: "", servicePrice: 0, labCost: 0, otherCosts: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem("nabil_academy_db");
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
    localStorage.setItem("nabil_academy_db", JSON.stringify(updated));
    alert("اطلاعات در آکادمی دندان‌پزشکی نبیل ثبت شد");
    setActiveTab("list");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-right text-slate-800 font-sans" dir="rtl">
      {/* منوی کناری با نام جدید */}
      <aside className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl p-6 hidden md:block">
        <h2 className="text-xl font-black text-blue-900 mb-8 border-b pb-4">آکادمی دندان‌پزشکی نبیل</h2>
        <nav className="space-y-3">
          <button onClick={() => setActiveTab("register")} className={`w-full p-3 rounded-xl font-bold transition ${activeTab === 'register' ? 'bg-blue-700 text-white shadow-md' : 'bg-slate-50 hover:bg-slate-100'}`}>ثبت مریض جدید</button>
          <button onClick={() => setActiveTab("list")} className={`w-full p-3 rounded-xl font-bold transition ${activeTab === 'list' ? 'bg-blue-700 text-white shadow-md' : 'bg-slate-50 hover:bg-slate-100'}`}>لیست کل مریضان</button>
          <button onClick={() => setActiveTab("nextVisits")} className={`w-full p-3 rounded-xl font-bold transition ${activeTab === 'nextVisits' ? 'bg-blue-700 text-white shadow-md' : 'bg-slate-50 hover:bg-slate-100'}`}>نوبت‌های بعدی</button>
        </nav>
      </aside>

      <main className="md:mr-64 p-8">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900">سیستم مدیریت آکادمی دندان‌پزشکی نبیل</h1>
          <p className="text-slate-500 mt-2">خوش آمدید دکتر نابل؛ مدیریت هوشمند مریضان و محاسبات مالی</p>
        </header>

        {activeTab === "register" && (
          <div className="max-w-4xl bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
             {/* فرم ثبت نام (باقی بخش‌ها مثل قبل) */}
             <h3 className="text-lg font-bold mb-6 text-blue-800">مشخصات مریض و پایواز</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input placeholder="نام مریض" className="p-3 bg-slate-50 rounded-lg border focus:ring-2 ring-blue-500 outline-none" onChange={e => setForm({...form, name: e.target.value})} />
                <input placeholder="تخلص" className="p-3 bg-slate-50 rounded-lg border focus:ring-2 ring-blue-500 outline-none" onChange={e => setForm({...form, lastName: e.target.value})} />
                <select className="p-3 bg-slate-50 rounded-lg border focus:ring-2 ring-blue-500 outline-none" onChange={e => setForm({...form, province: e.target.value})}>
                    {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input placeholder="شماره تماس" className="p-3 bg-slate-50 rounded-lg border focus:ring-2 ring-blue-500 outline-none" onChange={e => setForm({...form, phone: e.target.value})} />
                <input placeholder="تاریخ مراجعه" type="date" className="p-3 bg-slate-50 rounded-lg border" onChange={e => setForm({...form, visitDate: e.target.value})} />
                <input placeholder="تاریخ نوبت بعدی" type="date" className="p-3 bg-slate-50 rounded-lg border" onChange={e => setForm({...form, nextVisit: e.target.value})} />
             </div>

             <h3 className="text-lg font-bold mb-6 text-blue-800 border-t pt-6">بخش خدمات و هزینه</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm mb-2 font-bold">مجموع کل مبلغ دریافتی (افغانی):</label>
                    <input type="number" className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-xl font-black text-2xl text-blue-900" placeholder="0" onChange={e => setForm({...form, servicePrice: Number(e.target.value)})} />
                </div>
                <div className="flex gap-2 items-end">
                    <div className="w-1/2">
                        <label className="block text-sm mb-2 font-bold">هزینه لابراتوار:</label>
                        <input type="number" className="w-full p-3 bg-red-50 rounded-lg border" placeholder="0" onChange={e => setForm({...form, labCost: Number(e.target.value)})} />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-sm mb-2 font-bold">مصارف مواد/غذا:</label>
                        <input type="number" className="w-full p-3 bg-red-50 rounded-lg border" placeholder="0" onChange={e => setForm({...form, otherCosts: Number(e.target.value)})} />
                    </div>
                </div>
             </div>

             <button onClick={savePatient} className="w-full mt-10 bg-blue-800 text-white py-4 rounded-2xl font-black text-xl shadow-lg hover:bg-blue-900 transition-all transform hover:scale-[1.01]">ثبت در دیتابیس آکادمی</button>
          </div>
        )}

        {/* بخش لیست مریضان و نوبت‌دهی مشابه قبل با نام جدید نمایش داده می‌شود */}
        {activeTab === "list" && (
            <div className="space-y-4">
                <input placeholder="جستجوی سریع مریض..." className="w-full p-4 rounded-2xl shadow-sm border-none focus:ring-2 ring-blue-500" onChange={e => setSearchTerm(e.target.value)} />
                {patients.filter(p => p.name.includes(searchTerm)).map(p => (
                    <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
                        <div>
                            <h4 className="font-black text-xl text-slate-800">{p.name} {p.lastName}</h4>
                            <p className="text-blue-600 font-bold">{p.phone} - {p.province}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-dashed text-left">
                            <p className="text-xs font-bold text-slate-500">سهم دکتر نابل: <span className="text-green-600 text-sm">{p.drNabilShare.toLocaleString()}</span></p>
                            <p className="text-xs font-bold text-slate-500">سهم دکتر محفوظ: <span className="text-green-600 text-sm">{p.drMahfouzShare.toLocaleString()}</span></p>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
}
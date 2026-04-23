"use client";
import { useState, useEffect } from "react";

const provinces = ["کابل", "هرات", "بلخ", "قندهار", "ننگرهار", "پکتیا", "خوست", "غزنی", "لغمان", "بامیان", "بدخشان", "تخار", "کندز", "فاریاب", "جوزجان", "سرپل", "غور", "دایکندی", "اروزگان", "زابل", "نیمروز", "هلمند", "فراه", "بادغیس", "پنجشیر", "کاپیسا", "لوگر", "میدان وردک", "پروان", "کنر", "نورستان", "سمنگان", "بغلان", "پکتیکا"];

export default function NabilAcademyPro() {
  const [activeTab, setActiveTab] = useState("register");
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    name: "", fatherName: "", lastName: "", age: "", province: "کابل", phone: "", visitDate: "", nextVisit: "",
    attendantName: "", attendantPhone: "", relation: "پدر",
    bp: "", pulse: "", ox: "", temp: "",
    servicePrice: 0, labCost: 0, otherCosts: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem("nabil_pro_v3");
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
      drMohammadNaderShare: doctorsSplit,
      drMahfouzShare: doctorsSplit,
      netProfit
    };

    const updated = [newPatient, ...patients];
    setPatients(updated);
    localStorage.setItem("nabil_pro_v3", JSON.stringify(updated));
    alert("اطلاعات با موفقیت در سیستم آکادمی دندان‌پزشکی نبیل ثبت شد");
    setActiveTab("list");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-right text-slate-900" dir="rtl">
      <aside className="fixed right-0 top-0 h-full w-64 bg-white shadow-2xl p-6 hidden md:block border-l border-blue-100">
        <h2 className="text-xl font-black text-blue-900 mb-8 border-b pb-4">آکادمی دندان‌پزشکی نبیل</h2>
        <nav className="space-y-3">
          <button onClick={() => setActiveTab("register")} className={`w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'register' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-blue-50'}`}>➕ ثبت مریض جدید</button>
          <button onClick={() => setActiveTab("list")} className={`w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-blue-50'}`}>📋 لیست مریضان</button>
          <button onClick={() => setActiveTab("nextVisits")} className={`w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'nextVisits' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-blue-50'}`}>📅 نوبت‌های بعدی</button>
        </nav>
      </aside>

      <main className="md:mr-64 p-8">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900">مدیریت آکادمی نبیل</h1>
            <p className="text-blue-600 font-bold mt-1">پنل کاربری دکتر محمد نادر نبیل</p>
          </div>
        </header>

        {activeTab === "register" && (
          <div className="max-w-4xl bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200">
            <h3 className="text-xl font-black mb-8 text-slate-800 border-r-4 border-blue-600 pr-4">ثبت اطلاعات اولیه و معاینات</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <input placeholder="نام مریض" className="p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setForm({...form, name: e.target.value})} />
              <input placeholder="نام پدر" className="p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setForm({...form, fatherName: e.target.value})} />
              <input placeholder="تخلص" className="p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setForm({...form, lastName: e.target.value})} />
              <select className="p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setForm({...form, province: e.target.value})}>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input placeholder="شماره تماس" className="p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setForm({...form, phone: e.target.value})} />
              <input placeholder="تاریخ نوبت بعدی" type="date" className="p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setForm({...form, nextVisit: e.target.value})} />
            </div>

            <h3 className="text-xl font-black mb-8 text-slate-800 border-r-4 border-green-500 pr-4">محاسبات مالی و سهم اساتید</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-8 rounded-3xl">
              <div className="space-y-4">
                <label className="block font-black text-slate-700">مجموع دریافتی از مریض (افغانی):</label>
                <input type="number" className="w-full p-5 bg-white rounded-2xl border-none shadow-inner text-2xl font-black text-blue-700" placeholder="0" onChange={e => setForm({...form, servicePrice: Number(e.target.value)})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">هزینه لابراتوار:</label>
                  <input type="number" className="w-full p-3 bg-white rounded-xl border-none shadow-inner" placeholder="0" onChange={e => setForm({...form, labCost: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">مصارف (نان/مواد):</label>
                  <input type="number" className="w-full p-3 bg-white rounded-xl border-none shadow-inner" placeholder="0" onChange={e => setForm({...form, otherCosts: Number(e.target.value)})} />
                </div>
              </div>
            </div>

            <button onClick={savePatient} className="w-full mt-10 bg-blue-700 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl hover:bg-blue-800 transition-all transform hover:scale-[1.01]">ذخیره و تایید نهایی</button>
          </div>
        )}

        {activeTab === "list" && (
          <div className="space-y-6">
            <input placeholder="🔍 جستجوی مریض بر اساس نام یا آیدی..." className="w-full p-5 rounded-[1.5rem] border-none shadow-sm focus:ring-2 ring-blue-500 outline-none bg-white font-bold" onChange={e => setSearchTerm(e.target.value)} />
            {patients.filter(p => p.name.includes(searchTerm)).map(p => (
              <div key={p.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-wrap justify-between items-center">
                <div className="space-y-2">
                  <h4 className="font-black text-2xl text-slate-800">{p.name} {p.lastName}</h4>
                  <p className="text-blue-600 font-bold">{p.phone} | ولایت: {p.province}</p>
                </div>
                <div className="flex gap-4">
                   <div className="bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100 text-center">
                      <p className="text-xs text-slate-500 font-bold mb-1">سهم دکتر محمد نادر</p>
                      <p className="text-lg font-black text-blue-700">{p.drMohammadNaderShare.toLocaleString()}</p>
                   </div>
                   <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 text-center">
                      <p className="text-xs text-slate-500 font-bold mb-1">سهم دکتر محفوظ</p>
                      <p className="text-lg font-black text-slate-700">{p.drMahfouzShare.toLocaleString()}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
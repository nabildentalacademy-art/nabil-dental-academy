"use client";
import { useState, useEffect } from "react";

const provinces = ["کابل", "هرات", "بلخ", "قندهار", "ننگرهار", "پکتیا", "خوست", "غزنی", "لغمان", "بامیان", "بدخشان", "تخار", "کندز", "فاریاب", "جوزجان", "سرپل", "غور", "دایکندی", "اروزگان", "زابل", "نیمروز", "هلمند", "فراه", "بادغیس", "پنجشیر", "کاپیسا", "لوگر", "میدان وردک", "پروان", "کنر", "نورستان", "سمنگان", "بغلان", "پکتیکا"];
const relations = ["برادر", "پدر", "خواهر", "شوهر", "همسر", "کاکا", "ماما", "خسر", "خسربوره", "پسر کاکا", "پسرعمه", "پسر ماما", "پسرخاله", "دوست", "خواهر زاده", "برادر زاده"];

export default function NabilAcademyUltimate() {
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
    const saved = localStorage.getItem("nabil_academy_v9");
    if (saved) setPatients(JSON.parse(saved));
  }, []);

  const savePatient = () => {
    const netProfit = form.servicePrice - form.labCost - form.otherCosts;
    const ownerShare = netProfit * 0.25;
    const doctorsSplit = (netProfit - ownerShare) / 2;

    const newPatient = {
      ...form,
      id: Date.now(),
      ownerShare,
      drNabilShare: doctorsSplit,
      drMahfouzShare: doctorsSplit
    };

    const updated = [newPatient, ...patients];
    setPatients(updated);
    localStorage.setItem("nabil_academy_v9", JSON.stringify(updated));
    alert("معلومات در سیستم آکادمی نبیل ثبت شد.");
    setActiveTab("list");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-right font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-full w-64 bg-white shadow-2xl p-6 hidden md:block border-l-4 border-blue-800">
        <h2 className="text-xl font-black text-blue-900 mb-8 border-b pb-4">آکادمی نبیل</h2>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab("register")} className={`w-full p-4 rounded-xl font-bold transition ${activeTab==='register'?'bg-blue-800 text-white':'hover:bg-blue-50'}`}>ثبت مریض جدید</button>
          <button onClick={() => setActiveTab("list")} className={`w-full p-4 rounded-xl font-bold transition ${activeTab==='list'?'bg-blue-800 text-white':'hover:bg-blue-50'}`}>لیست مریضان</button>
          <button onClick={() => setActiveTab("nextVisits")} className={`w-full p-4 rounded-xl font-bold transition ${activeTab==='nextVisits'?'bg-blue-800 text-white':'hover:bg-blue-50'}`}>نوبت‌های بعدی</button>
        </nav>
      </aside>

      <main className="md:mr-64 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-black text-slate-800">سیستم مدیریت دکتر محمد نادر نبیل</h1>
          <p className="text-blue-600 font-bold">آکادمی دندان‌پزشکی نبیل</p>
        </header>

        {activeTab === "register" && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-8">
            {/* مشخصات عمومی */}
            <section>
              <h3 className="font-black text-blue-800 mb-4 border-r-4 border-blue-600 pr-2">۱. مشخصات مریض و پایواز</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input placeholder="نام مریض" className="p-3 bg-slate-50 rounded-xl border" onChange={e=>setForm({...form, name:e.target.value})} />
                <input placeholder="نام پدر" className="p-3 bg-slate-50 rounded-xl border" onChange={e=>setForm({...form, fatherName:e.target.value})} />
                <input placeholder="تخلص" className="p-3 bg-slate-50 rounded-xl border" onChange={e=>setForm({...form, lastName:e.target.value})} />
                <select className="p-3 bg-slate-50 rounded-xl border" onChange={e=>setForm({...form, province:e.target.value})}>
                  {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input placeholder="سن" type="number" className="p-3 bg-slate-50 rounded-xl border" onChange={e=>setForm({...form, age:e.target.value})} />
                <input placeholder="شماره تماس" className="p-3 bg-slate-50 rounded-xl border" onChange={e=>setForm({...form, phone:e.target.value})} />
                <input placeholder="تاریخ نوبت بعدی" type="date" className="p-3 bg-yellow-50 rounded-xl border border-yellow-200" onChange={e=>setForm({...form, nextVisit:e.target.value})} />
                <select className="p-3 bg-slate-50 rounded-xl border font-bold" onChange={e=>setForm({...form, relation:e.target.value})}>
                  <option>نسبت پایواز</option>
                  {relations.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </section>

            {/* معاینات عمومی */}
            <section>
              <h3 className="font-black text-green-800 mb-4 border-r-4 border-green-600 pr-2">۲. معاینات عمومی (Vitals)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input placeholder="فشار خون" className="p-3 border rounded-xl" onChange={e=>setForm({...form, bp:e.target.value})} />
                <input placeholder="نبض" className="p-3 border rounded-xl" onChange={e=>setForm({...form, pulse:e.target.value})} />
                <input placeholder="O2 خون" className="p-3 border rounded-xl" onChange={e=>setForm({...form, ox:e.target.value})} />
                <input placeholder="حرارت" className="p-3 border rounded-xl" onChange={e=>setForm({...form, temp:e.target.value})} />
              </div>
            </section>

            {/* بخش خدمات و مالی */}
            <section className="bg-slate-50 p-6 rounded-2xl">
              <h3 className="font-black text-slate-800 mb-4">۳. بخش خدمات و محاسبات مالی</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-1">مبلغ کل (افغانی):</label>
                  <input type="number" className="w-full p-4 rounded-xl text-2xl font-black text-blue-700 shadow-inner" onChange={e=>setForm({...form, servicePrice:Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">هزینه لابراتوار:</label>
                  <input type="number" className="w-full p-4 rounded-xl shadow-inner" onChange={e=>setForm({...form, labCost:Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">مصارف (مواد/غذا):</label>
                  <input type="number" className="w-full p-4 rounded-xl shadow-inner" onChange={e=>setForm({...form, otherCosts:Number(e.target.value)})} />
                </div>
              </div>
              <button onClick={savePatient} className="w-full mt-8 bg-blue-800 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-[1.01] transition">ذخیره نهایی در سیستم آکادمی</button>
            </section>
          </div>
        )}

        {activeTab === "list" && (
          <div className="space-y-4">
            <input placeholder="🔍 جستجوی مریض بر اساس نام یا تماس..." className="w-full p-4 rounded-2xl border shadow-sm" onChange={e=>setSearchTerm(e.target.value)} />
            {patients.filter(p => p.name.includes(searchTerm)).map(p => (
              <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="font-black text-xl text-slate-800">{p.name} {p.lastName}</h4>
                  <p className="text-sm text-blue-600 font-bold">{p.phone} | ولایت: {p.province}</p>
                </div>
                <div className="text-left bg-blue-50 p-4 rounded-2xl">
                  <p className="text-xs font-bold">سهم دکتر محمد نادر: <span className="text-
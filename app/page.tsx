"use client";
import { useState, useEffect } from "react";

const provinces = ["کابل", "هرات", "بلخ", "قندهار", "ننگرهار", "پکتیا", "خوست", "غزنی", "لغمان", "بامیان", "بدخشان", "تخار", "کندز", "فاریاب", "جوزجان", "سرپل", "غور", "دایکندی", "اروزگان", "زابل", "نیمروز", "هلمند", "فراه", "بادغیس", "پنجشیر", "کاپیسا", "لوگر", "میدان وردک", "پروان", "کنر", "نورستان", "سمنگان", "بغلان", "پکتیکا"];

const relations = ["برادر", "پدر", "خواهر", "شوهر", "همسر", "کاکا", "ماما", "خسر", "خسربوره", "پسر کاکا", "پسرعمه", "پسر ماما", "پسرخاله", "دوست", "خواهر زاده", "برادر زاده"];

export default function NabilAcademyFinal() {
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
    const saved = localStorage.getItem("nabil_v5_final");
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
      drMahfouzShare: doctorsSplit
    };

    const updated = [newPatient, ...patients];
    setPatients(updated);
    localStorage.setItem("nabil_v5_final", JSON.stringify(updated));
    alert("اطلاعات در آکادمی دندان‌پزشکی نبیل ثبت شد");
    setActiveTab("list");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-right text-slate-900" dir="rtl">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-full w-64 bg-white shadow-2xl p-6 hidden md:block border-l-4 border-blue-600">
        <h2 className="text-xl font-black text-blue-900 mb-8 border-b pb-4">آکادمی دندان‌پزشکی نبیل</h2>
        <nav className="space-y-3">
          <button onClick={() => setActiveTab("register")} className={`w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'register' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-blue-50'}`}>➕ ثبت مریض جدید</button>
          <button onClick={() => setActiveTab("list")} className={`w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-blue-50'}`}>📋 لیست مریضان</button>
          <button onClick={() => setActiveTab("nextVisits")} className={`w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'nextVisits' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-blue-50'}`}>📅 نوبت‌های بعدی</button>
        </nav>
      </aside>

      <main className="md:mr-64 p-8">
        <header className="mb-10 flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-900">پنل مدیریت دکتر محمد نادر نبیل</h1>
            <p className="text-blue-600 font-bold text-sm">آکادمی دندان‌پزشکی نبیل</p>
          </div>
        </header>

        {activeTab === "register" && (
          <div className="max-w-5xl bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black mb-6 text-blue-800 underline decoration-blue-200">۱. ثبت مشخصات مریض و پایواز</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <input placeholder="نام مریض" className="p-3 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 outline-none focus:ring-2 ring-blue-500" onChange={e => setForm({...form, name: e.target.value})} />
              <input placeholder="نام پدر" className="p-3 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 outline-none focus:ring-2 ring-blue-500" onChange={e => setForm({...form, fatherName: e.target.value})} />
              <input placeholder="تخلص" className="p-3 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 outline-none focus:ring-2 ring-blue-500" onChange={e => setForm({...form, lastName: e.target.value})} />
              <input placeholder="سن" type="number" className="p-3 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 outline-none focus:ring-2 ring-blue-500" onChange={e => setForm({...form, age: e.target.value})} />
              <select className="p-3 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 outline-none focus:ring-2 ring-blue-500 font-bold" onChange={e => setForm({...form, province: e.target.value})}>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input placeholder="شماره تماس" className="p-3 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 outline-none focus:ring-2 ring-blue-500" onChange={e => setForm({...form, phone: e.target.value})} />
              <input placeholder="تاریخ مراجعه" type="date" className="p-3 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200" onChange={e => setForm({...form, visitDate: e.target.value})} />
              <input placeholder="تاریخ نوبت بعدی" type="date" className="p-3 bg-slate-50 rounded-xl border-none ring-1 ring-blue-300" onChange={e => setForm({...form, nextVisit: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-blue-50 p-6 rounded-2xl">
              <input placeholder="نام پایواز" className="p-3 bg-white rounded-xl" onChange={e => setForm({...form, attendantName: e.target.value})} />
              <input placeholder="تماس پایواز" className="p-3 bg-white rounded-xl" onChange={e => setForm({...form, attendantPhone: e.target.value})} />
              <select className="p-3 bg-white rounded-xl" onChange={e => setForm({...form, relation: e.target.value})}>
                {relations.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <h3 className="text-lg font-black mb-6 text-green-700 underline decoration-green-200">۲. معاینات و محاسبات خدمات</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <input placeholder="فشار خون" className="p-3 bg-slate-50 rounded-xl border" onChange={e => setForm({...form, bp: e.target.value})} />
              <input placeholder="نبض" className="p-3 bg-slate-50 rounded-xl border" onChange={e => setForm({...form, pulse: e.target.value})} />
              <input placeholder="O2 خون" className="p-3 bg-slate-50 rounded-xl border" onChange={e => setForm({...form, ox: e.target.value})} />
              <input placeholder="حرارت بدن" className="p-3 bg-slate-50 rounded-xl border" onChange={e => setForm({...form, temp: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-100 rounded-2xl">
              <div>
                <label className="block font-black mb-2">قیمت خدمت طبق لیست (افغانی):</label>
                <input type="number" className="w-full p-4 rounded-xl text-2xl font-black text-blue-700 shadow-inner" placeholder="0" onChange={e => setForm({...form, servicePrice: Number(e.target.value)})} />
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-xs font-bold mb-2">مصرف لابراتوار:</label>
                  <input type="number" className="w-full p-3 rounded-xl shadow-inner" placeholder="0" onChange={e => setForm({...form, labCost: Number(e.target.value)})} />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-bold mb-2">مواد و نان چاشت:</label>
                  <input type="number" className="w-full p-3 rounded-xl shadow-inner" placeholder="0" onChange={e => setForm({...form, otherCosts: Number(e.target.value)})} />
                </div>
              </div>
            </div>

            <button onClick={savePatient} className="w-full mt-8 bg-blue-700 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl hover:bg-blue-800 transition-all transform hover:scale-[1.01]">ذخیره در دیتابیس آکادمی</button>
          </div>
        )}

        {activeTab === "list" && (
          <div className="space-y-4">
            <input placeholder="🔍 جستجو بر اساس نام یا شماره تماس..." className="w-full p-5 rounded-2xl shadow-sm border-none bg-white font-bold mb-6" onChange={e => setSearchTerm(e.target.value)} />
            {patients.filter(p => p.name.includes(searchTerm)).map(p => (
              <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center">
                <div>
                  <h4 className="font-black text-xl">{p.name} {p.lastName}</h4>
                  <p className="text-blue-600 font-bold text-sm">{p.phone} | ولایت: {p.province}</p>
                  <p className="text-xs text-slate-400 mt-2">پایواز: {p.attendantName} ({p.relation})</p>
                </div>
                <div className="text-left bg-slate-50 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-slate-500">سهم دکتر محمد نادر: <span className="text-green-600 text-lg font-black">{p.drMohammadNaderShare.toLocaleString()}</span></p>
                  <p className="text-[10px] text-red-400 font-bold">سهم مالک (۲۵٪): {p.ownerShare.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
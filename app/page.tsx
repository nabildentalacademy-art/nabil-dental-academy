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
    const saved = localStorage.getItem("nabil_v7_final");
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
    localStorage.setItem("nabil_v7_final", JSON.stringify(updated));
    alert("مریض با موفقیت ثبت شد");
    setActiveTab("list");
  };

  const handlePrint = (p: any) => {
    const win = window.open("", "_blank");
    win?.document.write(`
      <div dir="rtl" style="font-family: Tahoma; padding: 50px; border: 2px solid #1e40af;">
        <h1 style="text-align: center; color: #1e40af;">آکادمی دندان‌پزشکی نبیل</h1>
        <h3 style="text-align: center;">نسخه طبی - دکتر محمد نادر نبیل</h3>
        <hr/>
        <p><strong>نام مریض:</strong> ${p.name} ${p.lastName} | <strong>عمر:</strong> ${p.age} | <strong>تاریخ:</strong> ${new Date().toLocaleDateString('fa-IR')}</p>
        <div style="background: #f0f4ff; padding: 10px; border-radius: 10px;">
          <strong>علایم حیاتی:</strong> فشار: ${p.bp} | نبض: ${p.pulse} | اکسیجن: ${p.ox} | حرارت: ${p.temp}
        </div>
        <div style="margin-top: 50px; min-height: 300px; border-right: 3px solid #1e40af; padding-right: 20px;">
          <h2 style="color: #1e40af;">Rx:</h2>
        </div>
        <div style="margin-top: 50px; text-align: left;">
          <p>امضا و مهر معالج</p>
        </div>
      </div>
    `);
    win?.document.close();
    win?.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-right text-slate-900" dir="rtl">
      <aside className="fixed right-0 top-0 h-full w-64 bg-white shadow-2xl p-6 hidden md:block border-l-4 border-blue-600">
        <h2 className="text-xl font-black text-blue-900 mb-8 border-b pb-4">آکادمی نبیل</h2>
        <nav className="space-y-3">
          <button onClick={() => setActiveTab("register")} className={`w-full p-4 rounded-2xl font-bold ${activeTab === 'register' ? 'bg-blue-600 text-white' : 'bg-slate-50'}`}>ثبت مریض</button>
          <button onClick={() => setActiveTab("list")} className={`w-full p-4 rounded-2xl font-bold ${activeTab === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-50'}`}>لیست مریضان</button>
        </nav>
      </aside>

      <main className="md:mr-64 p-8">
        {activeTab === "register" ? (
          <div className="max-w-4xl bg-white p-8 rounded-3xl shadow-lg border">
            <h2 className="text-2xl font-black mb-6 text-blue-900">فرم جامع ثبت مریضان</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input placeholder="نام مریض" className="p-3 border rounded-xl" onChange={e => setForm({...form, name: e.target.value})} />
              <input placeholder="تخلص" className="p-3 border rounded-xl" onChange={e => setForm({...form, lastName: e.target.value})} />
              <select className="p-3 border rounded-xl" onChange={e => setForm({...form, province: e.target.value})}>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input placeholder="سن" className="p-3 border rounded-xl" onChange={e => setForm({...form, age: e.target.value})} />
              <input placeholder="شماره تماس" className="p-3 border rounded-xl" onChange={e => setForm({...form, phone: e.target.value})} />
              <input placeholder="تاریخ مراجعه بعدی" type="date" className="p-3 border rounded-xl" onChange={e => setForm({...form, nextVisit: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl">
              <input placeholder="فشار خون" className="p-2 border" onChange={e => setForm({...form, bp: e.target.value})} />
              <input placeholder="نبض" className="p-2 border" onChange={e => setForm({...form, pulse: e.target.value})} />
              <input placeholder="O2 خون" className="p-2 border" onChange={e => setForm({...form, ox: e.target.value})} />
              <input placeholder="حرارت" className="p-2 border" onChange={e => setForm({...form, temp: e.target.value})} />
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl mb-6">
              <h4 className="font-bold mb-4">بخش مالی</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input placeholder="مجموع دریافتی" type="number" className="p-3 rounded-xl font-bold" onChange={e => setForm({...form, servicePrice: Number(e.target.value)})} />
                <input placeholder="هزینه لابراتوار" type="number" className="p-3 rounded-xl" onChange={e => setForm({...form, labCost: Number(e.target.value)})} />
                <input placeholder="سایر مصارف" type="number" className="p-3 rounded-xl" onChange={e => setForm({...form, otherCosts: Number(e.target.value)})} />
              </div>
            </div>
            <button onClick={savePatient} className="w-full bg-blue-700 text-white py-4 rounded-2xl font-black text-xl">ذخیره نهایی و ثبت در سیستم</button>
          </div>
        ) : (
          <div className="space-y-4">
            <input placeholder="جستجوی مریض..." className="w-full p-4 rounded-2xl mb-6 border" onChange={e => setSearchTerm(e.target.value)} />
            {patients.filter(p => p.name.includes(searchTerm)).map(p => (
              <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
                <div>
                  <h4 className="font-black text-xl">{p.name} {p.lastName}</h4>
                  <p className="text-sm text-blue-600">سهم دکتر محمد نادر نبیل: {p.drMohammadNaderShare.toLocaleString()} افغانی</p>
                </div>
                <button onClick={() => handlePrint(p)} className="bg-blue-100 text-blue-700 px-6 py-2 rounded-xl font-bold">🖨 چاپ نسخه</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
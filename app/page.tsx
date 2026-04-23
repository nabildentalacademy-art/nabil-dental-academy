"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", note: "", amount: "" });

  useEffect(() => {
    const data = localStorage.getItem("nabil_clinic_final");
    if (data) setPatients(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("nabil_clinic_final", JSON.stringify(patients));
  }, [patients]);

  const handleSave = (e: any) => {
    e.preventDefault();
    if (!form.name || !form.phone) return alert("لطفاً نام و شماره را وارد کنید");
    const newP = { ...form, id: Date.now(), date: new Date().toLocaleDateString('fa-IR'), amount: Number(form.amount) || 0 };
    setPatients([newP, ...patients]);
    setForm({ name: "", phone: "", note: "", amount: "" });
    setActiveTab("dashboard");
  };

  const filtered = patients.filter(p => p.name.includes(searchTerm) || p.phone.includes(searchTerm));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row-reverse text-right text-black" dir="rtl">
      <aside className="w-full md:w-64 bg-white p-6 border-l shadow-sm">
        <h1 className="text-xl font-black text-blue-600 mb-8 text-center">مدیریت آکادمی نابل</h1>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full p-3 rounded-xl font-bold transition ${activeTab === "dashboard" ? "bg-blue-600 text-white shadow-md" : "bg-gray-50 text-gray-600"}`}>📋 لیست مراجعین</button>
          <button onClick={() => setActiveTab("register")} className={`w-full p-3 rounded-xl font-bold transition ${activeTab === "register" ? "bg-blue-600 text-white shadow-md" : "bg-gray-50 text-gray-600"}`}>➕ ثبت مورد جدید</button>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        {activeTab === "dashboard" ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-6 rounded-2xl mb-8 shadow-lg">
              <p className="opacity-80 text-sm mb-1">مجموع واریزی‌ها:</p>
              <h2 className="text-3xl font-black">{patients.reduce((s, p) => s + p.amount, 0).toLocaleString()} <span className="text-sm font-normal">افغانی</span></h2>
            </div>
            
            <input 
              placeholder="🔍 جستجو با نام یا شماره تماس..." 
              className="w-full p-4 rounded-2xl border-2 border-white mb-6 shadow-sm outline-none focus:border-blue-500 bg-white font-bold" 
              onChange={e => setSearchTerm(e.target.value)} 
              style={{ color: 'black' }}
            />

            <div className="grid gap-4">
              {filtered.map(p => (
                <div key={p.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
                  <div>
                    <p className="font-black text-lg text-gray-800">{p.name}</p>
                    <p className="text-blue-600 font-bold text-sm">{p.phone}</p>
                    <p className="text-gray-400 text-xs mt-1 font-medium">{p.date} {p.note && `| ${p.note}`}</p>
                  </div>
                  <div className="text-left font-black text-green-600 text-xl">{p.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSave} className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-50 space-y-5">
              <h2 className="text-xl font-black text-center text-gray-800 mb-2">ثبت مشخصات و مالی</h2>
              <input placeholder="نام بیمار / شاگرد" className="w-full p-4 border rounded-2xl bg-gray-50 font-bold outline-none focus:bg-white focus:border-blue-500 transition" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{color:'black'}} />
              <input placeholder="شماره تماس" className="w-full p-4 border rounded-2xl bg-gray-50 font-bold outline-none focus:bg-white focus:border-blue-500 transition" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{color:'black'}} />
              <input placeholder="مبلغ دریافتی" type="number" className="w-full p-4 border rounded-2xl bg-gray-50 font-bold outline-none focus:bg-white focus:border-blue-500 transition" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} style={{color:'black'}} />
              <textarea placeholder="توضیحات تکمیلی" className="w-full p-4 border rounded-2xl bg-gray-50 font-bold h-28 outline-none focus:bg-white focus:border-blue-500 transition" value={form.note} onChange={e => setForm({...form, note: e.target.value})} style={{color:'black'}} />
              <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all">ذخیره در دیتابیس</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
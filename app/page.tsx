"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", note: "", amount: "" });

  useEffect(() => {
    const data = localStorage.getItem("nabil_clinic_v1");
    if (data) setPatients(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("nabil_clinic_v1", JSON.stringify(patients));
  }, [patients]);

  const handleSave = (e: any) => {
    e.preventDefault();
    if (!form.name || !form.phone) return alert("نام و شماره الزامی است");
    const newP = { ...form, id: Date.now(), date: new Date().toLocaleDateString('fa-IR'), amount: Number(form.amount) || 0 };
    setPatients([newP, ...patients]);
    setForm({ name: "", phone: "", note: "", amount: "" });
    setActiveTab("dashboard");
  };

  const filtered = patients.filter(p => p.name.includes(searchTerm) || p.phone.includes(searchTerm));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row-reverse text-right text-black" dir="rtl">
      <aside className="w-full md:w-64 bg-white p-6 border-l shadow-sm">
        <h1 className="text-xl font-bold text-blue-600 mb-6">پنل کلینیک</h1>
        <button onClick={() => setActiveTab("dashboard")} className={`w-full p-3 mb-2 rounded-lg ${activeTab === "dashboard" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>لیست مراجعین</button>
        <button onClick={() => setActiveTab("register")} className={`w-full p-3 rounded-lg ${activeTab === "register" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>ثبت بیمار جدید</button>
      </aside>
      <main className="flex-1 p-6">
        {activeTab === "dashboard" ? (
          <div>
            <div className="bg-white p-6 rounded-2xl mb-6 shadow-sm border-r-4 border-green-500">
              <p className="text-gray-500 text-sm">مجموع درآمد:</p>
              <h2 className="text-2xl font-bold">{patients.reduce((s, p) => s + p.amount, 0).toLocaleString()}</h2>
            </div>
            <input placeholder="جستجو..." className="w-full p-3 rounded-xl border mb-6 outline-none" onChange={e => setSearchTerm(e.target.value)} />
            <div className="space-y-3">
              {filtered.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
                  <div>
                    <p className="font-bold">{p.name} <span className="text-xs text-gray-400">({p.date})</span></p>
                    <p className="text-blue-600 text-sm">{p.phone}</p>
                  </div>
                  <div className="font-bold text-green-600">{p.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm space-y-4">
            <input placeholder="نام" className="w-full p-3 border rounded-lg" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{color:'black'}} />
            <input placeholder="شماره" className="w-full p-3 border rounded-lg" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{color:'black'}} />
            <input placeholder="مبلغ" type="number" className="w-full p-3 border rounded-lg" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} style={{color:'black'}} />
            <textarea placeholder="یادداشت" className="w-full p-3 border rounded-lg h-24" value={form.note} onChange={e => setForm({...form, note: e.target.value})} style={{color:'black'}} />
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">ذخیره</button>
          </form>
        )}
      </main>
    </div>
  );
}
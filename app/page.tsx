"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://rcserllqzqpdodrbydtl.supabase.co",
  "sb_publishable_VSPksBvgJ0mVc83sd1FYOw_fn-1R03TCOmH7KjG5NfO4lW9Pz_r8f-1"
);

export default function NabilAcademyFinalApp() {
  const [activeTab, setActiveTab] = useState("register");
  const [patients, setPatients] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", lastName: "", price: 0 });

  const fetchPatients = async () => {
    const { data } = await supabase.from("patients").select("*").order("created_at", { ascending: false });
    if (data) setPatients(data);
  };

  useEffect(() => { fetchPatients(); }, []);

  const saveToDatabase = async () => {
    if (!form.name) return alert("لطفاً نام مریض را وارد کنید");
    
    // سهم ۷۵ درصد بعد از کسر مصارف و تقسیم بر دو
    const netProfit = form.price * 0.75;
    const share = netProfit / 2;

    const { error } = await supabase.from("patients").insert([{
      name: form.name,
      last_name: form.lastName,
      service_price: form.price,
      dr_nabil_share: share,
      dr_mahfouz_share: share
    }]);

    if (!error) {
      alert("✅ معلومات با موفقیت در دیتابیس ثبت شد");
      setForm({ name: "", lastName: "", price: 0 });
      fetchPatients();
      setActiveTab("list");
    } else {
      console.error(error);
      alert("❌ خطای دیتابیس: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black p-4" dir="rtl">
      <div className="max-w-md mx-auto">
        <header className="bg-blue-900 p-6 rounded-2xl text-white text-center shadow-lg mb-6">
          <h1 className="text-xl font-black">سیستم مدیریت داکتر محمد نادر نبیل</h1>
        </header>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab("register")} className={`flex-1 p-4 rounded-xl font-bold transition ${activeTab==='register'?'bg-blue-800 text-white shadow-md':'bg-white text-gray-400'}`}>ثبت مریض</button>
          <button onClick={() => setActiveTab("list")} className={`flex-1 p-4 rounded-xl font-bold transition ${activeTab==='list'?'bg-blue-800 text-white shadow-md':'bg-white text-gray-400'}`}>لیست کل</button>
        </div>

        {activeTab === "register" ? (
          <div className="bg-white p-6 rounded-3xl shadow-xl space-y-4">
            <input className="w-full p-4 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-black outline-none focus:border-blue-500" placeholder="نام مریض" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <input className="w-full p-4 rounded-xl border-2 border-gray-100 bg-gray-50 font-bold text-black outline-none focus:border-blue-500" placeholder="تخلص" value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})} />
            <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-100">
              <p className="text-center text-blue-900 font-black mb-2 text-sm">مبلغ دریافتی (افغانی)</p>
              <input type="number" className="w-full p-4 rounded-xl text-center text-2xl font-black text-blue-900 border-none outline-none shadow-inner" placeholder="0" value={form.price || ""} onChange={e=>setForm({...form, price:Number(e.target.value)})} />
            </div>
            <button onClick={saveToDatabase} className="w-full bg-blue-800 text-white py-5 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition">ذخیره و هماهنگ‌سازی</button>
          </div>
        ) : (
          <div className="space-y-3">
            {patients.map(p => (
              <div key={p.id} className="bg-white p-5 rounded-2xl border-r-8 border-blue-800 shadow-sm flex justify-between items-center">
                <div className="text-right">
                  <p className="font-black text-lg">{p.name} {p.last_name}</p>
                  <p className="text-xs text-blue-700 font-bold">سهم داکتر نبیل: {Number(p.dr_nabil_share).toLocaleString()} افغانی</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
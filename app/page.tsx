"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// استفاده از کلید استخراج شده از تصویر شما
const supabase = createClient(
  "https://rcserllqzqpdodrbydtl.supabase.co",
  "sb_publishable_VSPksBvgJ0mVc83sd1FYOw_fn-1R03TCOmH7KjG5NfO4lW9Pz_r8f-1"
);

export default function NabilAcademyFinal() {
  const [activeTab, setActiveTab] = useState("register");
  const [patients, setPatients] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", lastName: "", price: 0 });

  const fetchPatients = async () => {
    const { data } = await supabase.from("patients").select("*").order("created_at", { ascending: false });
    if (data) setPatients(data);
  };

  useEffect(() => { fetchPatients(); }, []);

  const saveToCloud = async () => {
    if (!form.name) return alert("لطفاً نام مریض را وارد کنید");
    
    const profit = form.price * 0.75;
    const share = profit / 2;

    const { error } = await supabase.from("patients").insert([{
      name: form.name,
      last_name: form.lastName,
      service_price: form.price,
      dr_nabil_share: share,
      dr_mahfouz_share: share
    }]);

    if (!error) {
      alert("✅ معلومات با موفقیت ثبت شد");
      setForm({ name: "", lastName: "", price: 0 });
      fetchPatients();
      setActiveTab("list");
    } else {
      alert("❌ خطای دیتابیس: نام ستون‌ها را در Supabase انگلیسی کنید");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 p-4" dir="rtl">
      <div className="max-w-md mx-auto">
        <header className="bg-blue-900 p-6 rounded-2xl text-white text-center mb-6">
          <h1 className="text-xl font-black">پنل مدیریت دکتر نبیل</h1>
        </header>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab("register")} className={`flex-1 p-4 rounded-xl font-bold ${activeTab==='register'?'bg-blue-800 text-white':'bg-slate-100'}`}>ثبت جدید</button>
          <button onClick={() => setActiveTab("list")} className={`flex-1 p-4 rounded-xl font-bold ${activeTab==='list'?'bg-blue-800 text-white':'bg-slate-100'}`}>لیست ({patients.length})</button>
        </div>

        {activeTab === "register" ? (
          <div className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 space-y-4">
            <input className="w-full p-4 rounded-xl border-2 border-slate-200 text-black font-bold focus:border-blue-500 outline-none" placeholder="نام مریض" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <input className="w-full p-4 rounded-xl border-2 border-slate-200 text-black font-bold focus:border-blue-500 outline-none" placeholder="تخلص" value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})} />
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <p className="text-center font-bold text-blue-900 mb-2">مبلغ کل (افغانی)</p>
              <input type="number" className="w-full p-4 rounded-xl text-center text-2xl font-black text-blue-900" value={form.price || ""} onChange={e=>setForm({...form, price:Number(e.target.value)})} />
            </div>
            <button onClick={saveToCloud} className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black text-lg shadow-lg">💾 ذخیره در دیتابیس</button>
          </div>
        ) : (
          <div className="space-y-3">
            {patients.map(p => (
              <div key={p.id} className="p-4 bg-white rounded-xl border-r-8 border-blue-900 shadow flex justify-between items-center">
                <div className="text-right">
                  <p className="font-black text-slate-900">{p.name} {p.last_name}</p>
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
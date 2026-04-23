"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://rcserllqzqpdodrbydtl.supabase.co",
  "sb_publishable_VSPksBvgJ0mVc83sd1FYOw_fn-1R03TCOmH7KjG5NfO4lW9Pz_r8f-1"
);

export default function NabilAcademyApp() {
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
    const share = (form.price * 0.75) / 2;
    const { error } = await supabase.from("patients").insert([{
      name: form.name,
      last_name: form.lastName,
      service_price: form.price,
      dr_nabil_share: share,
      dr_mahfouz_share: share
    }]);

    if (!error) {
      alert("✅ موفقانه ثبت شد");
      setForm({ name: "", lastName: "", price: 0 });
      fetchPatients();
      setActiveTab("list");
    } else {
      alert("❌ خطا در اتصال به دیتابیس");
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4" dir="rtl">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <header className="bg-blue-900 p-6 text-white text-center">
          <h1 className="text-xl font-bold">مدیریت آکادمی دکتر نبیل</h1>
        </header>
        <div className="flex bg-slate-100">
          <button onClick={() => setActiveTab("register")} className={`flex-1 py-4 font-bold ${activeTab === 'register' ? 'bg-white text-blue-900' : 'text-slate-500'}`}>ثبت مریض</button>
          <button onClick={() => setActiveTab("list")} className={`flex-1 py-4 font-bold ${activeTab === 'list' ? 'bg-white text-blue-900' : 'text-slate-500'}`}>لیست کل</button>
        </div>
        <div className="p-6 space-y-4">
          {activeTab === "register" ? (
            <>
              <input className="w-full p-4 rounded-xl border-2 text-black" placeholder="نام مریض" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
              <input className="w-full p-4 rounded-xl border-2 text-black" placeholder="تخلص" value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})} />
              <input type="number" className="w-full p-4 rounded-xl border-2 text-center text-2xl font-bold text-blue-900" placeholder="مبلغ (افغانی)" value={form.price} onChange={e=>setForm({...form, price:Number(e.target.value)})} />
              <button onClick={saveToDatabase} className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold">ذخیره در دیتابیس</button>
            </>
          ) : (
            <div className="space-y-3">
              {patients.map(p => (
                <div key={p.id} className="p-4 bg-slate-50 rounded-xl border-r-4 border-blue-900 flex justify-between items-center">
                  <div className="flex flex-col"><span className="font-bold text-black">{p.name} {p.last_name}</span><span className="text-xs text-slate-400">{new Date(p.created_at).toLocaleDateString('fa-IR')}</span></div>
                  <span className="text-blue-700 font-bold">{Number(p.dr_nabil_share).toLocaleString()} افغانی</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// اتصال مستقیم با استفاده از تنظیمات استخراج شده از تصویر شما
const supabase = createClient(
  "https://rcserllqzqpdodrbydtl.supabase.co",
  "sb_publishable_VSPksBvgJ0mVc83sd1FYOw_fn-1R03TCOmH7KjG5NfO4lW9Pz_r8f-1"
);

export default function NabilAcademyPortal() {
  const [activeTab, setActiveTab] = useState("register");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", lastName: "", price: 0 });

  const fetchPatients = async () => {
    setLoading(true);
    const { data } = await supabase.from("patients").select("*").order("created_at", { ascending: false });
    if (data) setPatients(data);
    setLoading(false);
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleSave = async () => {
    if (!form.name) return alert("Please enter name");
    
    const profit = form.price * 0.75;
    const share = profit / 2;

    const { error } = await supabase.from("patients").insert([{
      name: form.name,
      last_name: form.lastName,
      service_price: form.price,
      dr_nabil_share: share,
      dr_mahfouz_share: share,
      owner_share: form.price * 0.25
    }]);

    if (!error) {
      alert("معلومات با موفقیت ذخیره شد");
      setForm({ name: "", lastName: "", price: 0 });
      fetchPatients();
      setActiveTab("list");
    } else {
      alert("Database Connection Error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4" dir="rtl">
      <div className="max-w-md mx-auto">
        <header className="bg-blue-800 text-white p-6 rounded-2xl shadow-lg text-center mb-6">
          <h1 className="text-2xl font-black">آکادمی دندان‌پزشکی نبیل</h1>
        </header>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab("register")} className={`flex-1 p-4 rounded-xl font-bold ${activeTab==='register'?'bg-blue-800 text-white shadow-md':'bg-white text-gray-500'}`}>ثبت مریض</button>
          <button onClick={() => setActiveTab("list")} className={`flex-1 p-4 rounded-xl font-bold ${activeTab==='list'?'bg-blue-800 text-white shadow-md':'bg-white text-gray-500'}`}>لیست کل</button>
        </div>

        {activeTab === "register" ? (
          <div className="bg-white p-6 rounded-3xl shadow-xl space-y-4 border border-gray-100">
            <input className="w-full p-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-900 font-bold outline-none focus:border-blue-500" placeholder="نام مریض" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <input className="w-full p-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-900 font-bold outline-none focus:border-blue-500" placeholder="تخلص" value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})} />
            <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-100">
                <p className="text-center text-blue-900 font-black mb-2">مبلغ دریافتی (افغانی)</p>
                <input type="number" className="w-full p-4 rounded-xl text-center text-2xl font-black text-blue-900 border-2 border-blue-200" placeholder="0" value={form.price || ""} onChange={e=>setForm({...form, price:Number(e.target.value)})} />
            </div>
            <button onClick={handleSave} className="w-full bg-blue-800 text-white py-5 rounded-2xl font-black text-xl shadow-lg active:scale-95 transition">💾 ذخیره در دیتابیس ابری</button>
          </div>
        ) : (
          <div className="space-y-3">
            {patients.map(p => (
              <div key={p.id} className="bg-white p-5 rounded-2xl border-r-8 border-blue-800 shadow-sm flex justify-between items-center">
                <div className="text-right text-gray-900">
                  <p className="font-black text-lg">{p.name} {p.last_name}</p>
                  <p className="text-xs text-blue-700 font-bold">سهم دکتر نابل: {Number(p.dr_nabil_share).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
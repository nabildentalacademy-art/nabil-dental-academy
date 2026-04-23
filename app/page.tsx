"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// اتصال مستقیم با کلید صحیح استخراج شده از تصاویر شما
const supabase = createClient(
  "https://rcserllqzqpdodrbydtl.supabase.co",
  "sb_publishable_VSPksBvgJ0mVc83sd1FYOw_fn-1R03TCOmH7KjG5NfO4lW9Pz_r8f-1"
);

export default function NabilAppFixed() {
  const [activeTab, setActiveTab] = useState("register");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", lastName: "", phone: "", price: 0 });

  const fetchPatients = async () => {
    setLoading(true);
    const { data } = await supabase.from("patients").select("*").order("created_at", { ascending: false });
    if (data) setPatients(data);
    setLoading(false);
  };

  useEffect(() => { fetchPatients(); }, []);

  const savePatient = async () => {
    if (!form.name) return alert("لطفاً نام مریض را وارد کنید");
    const net = form.price * 0.75;
    const share = net / 2;

    const { error } = await supabase.from("patients").insert([{
      name: form.name,
      last_name: form.lastName,
      service_price: form.price,
      dr_nabil_share: share,
      dr_mahfouz_share: share,
      owner_share: form.price * 0.25
    }]);

    if (!error) {
      alert("معلومات با موفقیت ثبت شد");
      setForm({ name: "", lastName: "", phone: "", price: 0 });
      fetchPatients();
      setActiveTab("list");
    } else {
      alert("خطای اتصال: کلید دیتابیس را چک کنید");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4" dir="rtl">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <header className="bg-blue-900 p-6 text-white text-center">
          <h1 className="text-xl font-black">آکادمی دندان‌پزشکی نبیل</h1>
        </header>

        <div className="flex border-b">
          <button onClick={() => setActiveTab("register")} className={`flex-1 py-4 font-bold ${activeTab === 'register' ? 'bg-blue-50 text-blue-900 border-b-4 border-blue-900' : 'text-slate-400'}`}>ثبت مریض</button>
          <button onClick={() => setActiveTab("list")} className={`flex-1 py-4 font-bold ${activeTab === 'list' ? 'bg-blue-50 text-blue-900 border-b-4 border-blue-900' : 'text-slate-400'}`}>لیست ({patients.length})</button>
        </div>

        <div className="p-6 space-y-4">
          {activeTab === "register" ? (
            <>
              <input className="w-full p-4 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 font-bold placeholder-slate-400 focus:border-blue-500 outline-none" placeholder="نام مریض" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
              <input className="w-full p-4 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 font-bold placeholder-slate-400" placeholder="تخلص" value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})} />
              <div className="bg-blue-50 p-4 rounded-2xl">
                <label className="block text-blue-900 font-black text-center mb-2">مبلغ دریافتی (افغانی)</label>
                <input type="number" className="w-full p-4 rounded-xl border-2 border-blue-200 text-blue-900 font-black text-2xl text-center" placeholder="0" value={form.price || ""} onChange={e=>setForm({...form, price:Number(e.target.value)})} />
              </div>
              <button onClick={savePatient} className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition">💾 ذخیره در دیتابیس ابری</button>
            </>
          ) : (
            <div className="space-y-2">
              {patients.map(p => (
                <div key={p.id} className="p-4 bg-slate-50 rounded-xl border flex justify-between items-center shadow-sm">
                  <div className="text-right">
                    <p className="font-black text-slate-900">{p.name} {p.last_name}</p>
                    <p className="text-xs text-blue-700 font-bold">سهم دکتر نابل: {Number(p.dr_nabil_share).toLocaleString()} افغانی</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
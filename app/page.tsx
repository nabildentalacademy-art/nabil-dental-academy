"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// حتماً کد طولانی را از پنل Supabase کپی کرده و اینجا جایگزین کنید
const supabase = createClient(
  "https://rcserllqzqpdodrbydtl.supabase.co",
  "کد_طولانی_را_اینجا_بگذارید" 
);

const provinces = ["کابل", "هرات", "بلخ", "قندهار", "ننگرهار", "پکتیا", "خوست", "غزنی", "لغمان", "بامیان", "بدخشان", "تخار", "کندز", "فاریاب", "جوزجان", "سرپل", "غور", "دایکندی", "اروزگان", "زابل", "نیمروز", "هلمند", "فراه", "بادغیس", "پنجشیر", "کاپیسا", "لوگر", "میدان وردک", "پروان", "کنر", "نورستان", "سمنگان", "بغلان", "پکتیکا"];
const relations = ["برادر", "پدر", "خواهر", "شوهر", "همسر", "کاکا", "ماما", "خسر", "خسربوره", "پسر کاکا", "پسرعمه", "پسر ماما", "پسرخاله", "دوست", "خواهر زاده", "برادر زاده"];

export default function NabilAcademyFixed() {
  const [activeTab, setActiveTab] = useState("register");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", lastName: "", phone: "", province: "کابل", servicePrice: 0, 
    labCost: 0, otherCosts: 0, bp: "", ox: "", attendantName: "", relation: "پدر"
  });

  const fetchPatients = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("patients").select("*").order("created_at", { ascending: false });
    if (!error && data) setPatients(data);
    setLoading(false);
  };

  useEffect(() => { fetchPatients(); }, []);

  const savePatient = async () => {
    if (!form.name) return alert("لطفاً نام مریض را وارد کنید");
    
    const netProfit = form.servicePrice - form.labCost - form.otherCosts;
    const ownerShare = netProfit * 0.25;
    const share = (netProfit - ownerShare) / 2;

    const { error } = await supabase.from("patients").insert([{
      ...form,
      owner_share: ownerShare,
      dr_nabil_share: share,
      dr_mahfouz_share: share
    }]);

    if (!error) {
      alert("با موفقیت ذخیره شد");
      fetchPatients();
      setActiveTab("list");
    } else {
      alert("خطا: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 p-4 md:p-8" dir="rtl">
      <header className="mb-6 border-b-2 pb-4 text-center">
        <h1 className="text-2xl font-bold text-blue-900">آکادمی دندان‌پزشکی نبیل</h1>
        <p className="text-slate-600">مدیریت ابری (هماهنگ با موبایل)</p>
      </header>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab("register")} className={`flex-1 p-4 rounded-xl font-bold ${activeTab==='register'?'bg-blue-600 text-white':'bg-slate-100 text-slate-700'}`}>ثبت مریض</button>
        <button onClick={() => setActiveTab("list")} className={`flex-1 p-4 rounded-xl font-bold ${activeTab==='list'?'bg-blue-600 text-white':'bg-slate-100 text-slate-700'}`}>لیست مریضان</button>
      </div>

      {activeTab === "register" ? (
        <div className="max-w-xl mx-auto space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <input placeholder="نام مریض" className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-900" onChange={e=>setForm({...form, name:e.target.value})} />
          <input placeholder="تخلص" className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-900" onChange={e=>setForm({...form, lastName:e.target.value})} />
          <input placeholder="شماره تماس" className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-900 text-left" onChange={e=>setForm({...form, phone:e.target.value})} />
          
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="فشار خون" className="p-4 rounded-xl border border-slate-300 bg-white text-slate-900" onChange={e=>setForm({...form, bp:e.target.value})} />
            <input placeholder="O2 خون" className="p-4 rounded-xl border border-slate-300 bg-white text-slate-900" onChange={e=>setForm({...form, ox:e.target.value})} />
          </div>

          <div className="bg-blue-100 p-4 rounded-xl space-y-3">
             <label className="block font-bold text-blue-900 text-sm">محاسبات مالی:</label>
             <input placeholder="مبلغ کل (افغانی)" type="number" className="w-full p-4 rounded-xl border-2 border-blue-300 bg-white text-blue-900 font-bold" onChange={e=>setForm({...form, servicePrice:Number(e.target.value)})} />
             <input placeholder="هزینه لابراتوار" type="number" className="w-full p-4 rounded-xl border border-slate-200 bg-white text-red-600" onChange={e=>setForm({...form, labCost:Number(e.target.value)})} />
          </div>

          <button onClick={savePatient} className="w-full bg-blue-700 text-white py-5 rounded-2xl font-black text-xl shadow-lg">ذخیره در دیتابیس ابری</button>
        </div>
      ) : (
        <div className="space-y-3">
          {loading ? <p className="text-center font-bold">در حال بارگذاری...</p> : 
            patients.map(p => (
              <div key={p.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{p.name} {p.lastName}</h3>
                  <p className="text-blue-600 font-bold">{p.phone}</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500">سهم دکتر نابل:</p>
                  <p className="text-green-700 font-black">{Number(p.dr_nabil_share).toLocaleString()} افغانی</p>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}
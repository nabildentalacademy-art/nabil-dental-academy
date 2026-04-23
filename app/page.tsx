"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// اتصال مستقیم به دیتابیس آکادمی نبیل در Supabase
const supabase = createClient(
  "https://rcserllqzqpdodrbydtl.supabase.co",
  "sb_publishable_VSPksBvgJ0mVc83sd1FYOw_fn-1R..." // این کلید را از بخش anon key اسکرین‌شات شما برداشتم
);

const provinces = ["کابل", "هرات", "بلخ", "قندهار", "ننگرهار", "پکتیا", "خوست", "غزنی", "لغمان", "بامیان", "بدخشان", "تخار", "کندز", "فاریاب", "جوزجان", "سرپل", "غور", "دایکندی", "اروزگان", "زابل", "نیمروز", "هلمند", "فراه", "بادغیس", "پنجشیر", "کاپیسا", "لوگر", "میدان وردک", "پروان", "کنر", "نورستان", "سمنگان", "بغلان", "پکتیکا"];

export default function NabilAcademyCloud() {
  const [activeTab, setActiveTab] = useState("register");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", lastName: "", phone: "", province: "کابل", nextVisit: "", bp: "", ox: "", servicePrice: 0
  });

  // دریافت اطلاعات از ابر در هر دو دستگاه (مبایل و کمپیوتر)
  const fetchPatients = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("patients").select("*").order("created_at", { ascending: false });
    if (!error && data) setPatients(data);
    setLoading(false);
  };

  useEffect(() => { fetchPatients(); }, []);

  const saveToCloud = async () => {
    const netProfit = form.servicePrice * 0.75; // کسر ۲۵ درصد سهم مالک
    const share = netProfit / 2;

    const { error } = await supabase.from("patients").insert([{
      ...form,
      dr_nabil_share: share,
      dr_mahfouz_share: share,
      owner_share: form.servicePrice * 0.25
    }]);

    if (error) {
        alert("خطا در اتصال به ابر: " + error.message);
    } else {
        alert("موفقیت! اطلاعات در ابر ذخیره شد و در تمام دستگاه‌های شما قابل مشاهده است.");
        setForm({ name: "", lastName: "", phone: "", province: "کابل", nextVisit: "", bp: "", ox: "", servicePrice: 0 });
        fetchPatients();
        setActiveTab("list");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-right p-4 md:p-8" dir="rtl">
      <header className="mb-8 border-b-4 border-blue-700 pb-4">
        <h1 className="text-2xl font-black text-blue-900">آکادمی دندان‌پزشکی نبیل (نسخه ابری)</h1>
        <p className="text-slate-500 font-bold">دکتر محمد نادر نبیل</p>
      </header>

      <nav className="flex gap-2 mb-8">
        <button onClick={() => setActiveTab("register")} className={`flex-1 p-4 rounded-xl font-bold ${activeTab === 'register' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white'}`}>ثبت مریض</button>
        <button onClick={() => setActiveTab("list")} className={`flex-1 p-4 rounded-xl font-bold ${activeTab === 'list' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white'}`}>لیست مریضان ({patients.length})</button>
      </nav>

      {activeTab === "register" && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-3xl shadow-xl space-y-4">
          <input placeholder="نام مریض" className="w-full p-4 border rounded-2xl" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input placeholder="تخلص" className="w-full p-4 border rounded-2xl" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
          <input placeholder="شماره تماس" className="w-full p-4 border rounded-2xl text-left" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="فشار خون" className="p-4 border rounded-2xl" onChange={e => setForm({...form, bp: e.target.value})} />
            <input placeholder="O2 خون" className="p-4 border rounded-2xl" onChange={e => setForm({...form, ox: e.target.value})} />
          </div>
          <input placeholder="مبلغ دریافتی (افغانی)" type="number" className="w-full p-4 border-2 border-blue-100 rounded-2xl text-xl font-black" onChange={e => setForm({...form, servicePrice: Number(e.target.value)})} />
          <button onClick={saveToCloud} className="w-full bg-blue-700 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-800 transition shadow-xl">ذخیره در دیتابیس ابری</button>
        </div>
      )}

      {activeTab === "list" && (
        <div className="space-y-4">
          {loading ? <p className="text-center font-bold">در حال دریافت اطلاعات از ابر...</p> : 
            patients.map(p => (
              <div key={p.id} className="bg-white p-5 rounded-2xl shadow-sm border-r-8 border-blue-600 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-lg">{p.name} {p.lastName}</h3>
                  <p className="text-blue-600 text-sm font-bold">{p.phone}</p>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400">سهم دکتر نابل:</p>
                  <p className="text-green-600 font-black">{Number(p.dr_nabil_share).toLocaleString()} افغانی</p>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://rcserllqzqpdodrbydtl.supabase.co",
  "sb_publishable_VSPksBvgJ0mVc83sd1FYOw_fn-1R03TCOmH7KjG5NfO4lW9Pz_r8f-1" 
);

const provinces = ["کابل", "هرات", "بلخ", "قندهار", "ننگرهار", "پکتیا", "خوست", "غزنی", "لغمان", "بامیان", "بدخشان", "تخار", "کندز", "فاریاب", "جوزجان", "سرپل", "غور", "دایکندی", "اروزگان", "زابل", "نیمروز", "هلمند", "فراه", "بادغیس", "پنجشیر", "کاپیسا", "لوگر", "میدان وردک", "پروان", "کنر", "نورستان", "سمنگان", "بغلان", "پکتیکا"];
const relations = ["برادر", "پدر", "خواهر", "شوهر", "همسر", "کاکا", "ماما", "خسر", "خسربوره", "پسر کاکا", "پسرعمه", "پسر ماما", "پسرخاله", "دوست", "خواهر زاده", "برادر زاده"];

export default function NabilAcademyUltimateCloud() {
  const [activeTab, setActiveTab] = useState("register");
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", fatherName: "", lastName: "", age: "", province: "کابل", phone: "", visitDate: "", nextVisit: "",
    attendantName: "", attendantPhone: "", relation: "پدر",
    bp: "", pulse: "", ox: "", temp: "",
    servicePrice: 0, labCost: 0, otherCosts: 0
  });

  const fetchPatients = async () => {
    setLoading(true);
    const { data } = await supabase.from("patients").select("*").order("created_at", { ascending: false });
    if (data) setPatients(data);
    setLoading(false);
  };

  useEffect(() => { fetchPatients(); }, []);

  const savePatient = async () => {
    const netProfit = form.servicePrice - form.labCost - form.otherCosts;
    const ownerShare = netProfit * 0.25;
    const doctorsSplit = (netProfit - ownerShare) / 2;

    const { error } = await supabase.from("patients").insert([{
      ...form,
      owner_share: ownerShare,
      dr_nabil_share: doctorsSplit,
      dr_mahfouz_share: doctorsSplit
    }]);

    if (!error) {
      alert("معلومات با موفقیت در ابر ذخیره شد.");
      fetchPatients();
      setActiveTab("list");
    } else {
      alert("خطا در ذخیره سازی: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-right font-sans" dir="rtl">
      <aside className="fixed right-0 top-0 h-full w-64 bg-white shadow-2xl p-6 hidden md:block border-l-4 border-blue-800">
        <h2 className="text-xl font-black text-blue-900 mb-8 border-b pb-4 text-center">آکادمی نبیل</h2>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab("register")} className={`w-full p-4 rounded-xl font-bold transition ${activeTab==='register'?'bg-blue-800 text-white':'hover:bg-blue-50'}`}>ثبت مریض جدید</button>
          <button onClick={() => setActiveTab("list")} className={`w-full p-4 rounded-xl font-bold transition ${activeTab==='list'?'bg-blue-800 text-white':'hover:bg-blue-50'}`}>لیست مریضان</button>
        </nav>
      </aside>

      <main className="md:mr-64 p-8">
        <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-800">دکتر محمد نادر نبیل</h1>
            <p className="text-blue-600 font-bold">مدیریت آکادمی دندان‌پزشکی نبیل</p>
          </div>
        </header>

        {activeTab === "register" && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-8 max-w-5xl">
            <section>
              <h3 className="font-black text-blue-800 mb-4 border-r-4 border-blue-600 pr-2 text-lg">۱. مشخصات مریض و پایواز</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input placeholder="نام مریض" className="p-3 bg-slate-50 rounded-xl border" onChange={e=>setForm({...form, name:e.target.value})} />
                <input placeholder="نام پدر" className="p-3 bg-slate-50 rounded-xl border" onChange={e=>setForm({...form, fatherName:e.target.value})} />
                <input placeholder="تخلص" className="p-3 bg-slate-50 rounded-xl border" onChange={e=>setForm({...form, lastName:e.target.value})} />
                <select className="p-3 bg-slate-50 rounded-xl border" onChange={e=>setForm({...form, province:e.target.value})}>
                  {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input placeholder="شماره تماس" className="p-3 bg-slate-50 rounded-xl border text-left" onChange={e=>setForm({...form, phone:e.target.value})} />
                <input placeholder="تاریخ نوبت بعدی" type="date" className="p-3 bg-yellow-50 rounded-xl border border-yellow-200" onChange={e=>setForm({...form, nextVisit:e.target.value})} />
                <input placeholder="نام پایواز" className="p-3 bg-slate-50 rounded-xl border" onChange={e=>setForm({...form, attendantName:e.target.value})} />
                <select className="p-3 bg-slate-50 rounded-xl border font-bold" onChange={e=>setForm({...form, relation:e.target.value})}>
                  {relations.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </section>

            <section>
              <h3 className="font-black text-green-800 mb-4 border-r-4 border-green-600 pr-2 text-lg">۲. معاینات عمومی</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input placeholder="فشار خون" className="p-3 border rounded-xl" onChange={e=>setForm({...form, bp:e.target.value})} />
                <input placeholder="O2 خون" className="p-3 border rounded-xl" onChange={e=>setForm({...form, ox:e.target.value})} />
                <input placeholder="نبض" className="p-3 border rounded-xl" onChange={e=>setForm({...form, pulse:e.target.value})} />
                <input placeholder="حرارت" className="p-3 border rounded-xl" onChange={e=>setForm({...form, temp:e.target.value})} />
              </div>
            </section>

            <section className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-blue-200">
              <h3 className="font-black text-slate-800 mb-4 text-lg underline decoration-blue-300">۳. محاسبات مالی (افغانی)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-1 text-blue-700">مجموع دریافتی:</label>
                  <input type="number" className="w-full p-4 rounded-xl text-2xl font-black bg-white shadow-sm" onChange={e=>setForm({...form, servicePrice:Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-red-600">هزینه لابراتوار:</label>
                  <input type="number" className="w-full p-4 rounded-xl bg-white shadow-sm" onChange={e=>setForm({...form, labCost:Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">سایر مصارف:</label>
                  <input type="number" className="w-full p-4 rounded-xl bg-white shadow-sm" onChange={e=>setForm({...form, otherCosts:Number(e.target.value)})} />
                </div>
              </div>
              <button onClick={savePatient} className="w-full mt-8 bg-blue-800 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-[1.01] transition">ذخیره نهایی در دیتابیس ابری</button>
            </section>
          </div>
        )}

        {activeTab === "list" && (
          <div className="space-y-4">
            <input placeholder="🔍 جستجو بر اساس نام یا تماس..." className="w-full p-4 rounded-2xl border bg-white shadow-sm font-bold mb-6" onChange={e=>setSearchTerm(e.target.value)} />
            {loading ? <p className="text-center py-10 font-bold">در حال دریافت لیست مریضان از ابر...</p> : 
              patients.filter(p => p.name?.includes(searchTerm)).map(p => (
                <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border flex justify-between items-center transition hover:shadow-md">
                  <div>
                    <h4 className="font-black text-xl text-slate-800">{p.name} {p.lastName}</h4>
                    <p className="text-sm text-blue-600 font-bold">{p.phone} | ولایت: {p.province}</p>
                    <p className="text-[10px] text-slate-400 mt-2">پایواز: {p.attendant_name} ({p.relation})</p>
                  </div>
                  <div className="text-left bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-xs font-bold">سهم دکتر نابل: <span className="text-green-600 text-lg font-black">{Number(p.dr_nabil_share).toLocaleString()}</span></p>
                    <p className="text-[10px] text-red-400 font-bold">سهم مالک (۲۵٪): {Number(p.owner_share).toLocaleString()}</p>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </main>
    </div>
  );
}
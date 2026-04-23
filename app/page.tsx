"use client";
import { useState, useEffect } from "react";

const provinces = ["کابل", "هرات", "بلخ", "قندهار", "ننگرهار", "پکتیا", "خوست", "غزنی", "لغمان", "بامیان", "بدخشان", "تخار", "کندز", "فاریاب", "جوزجان", "سرپل", "غور", "دایکندی", "اروزگان", "زابل", "نیمروز", "هلمند", "فراه", "بادغیس", "پنجشیر", "کاپیسا", "لوگر", "میدان وردک", "پروان", "کنر", "نورستان", "سمنگان", "بغلان", "پکتیکا"];
const relations = ["برادر", "پدر", "خواهر", "شوهر", "همسر", "کاکا", "ماما", "خسر", "خسربوره", "پسر کاکا", "پسرعمه", "پسر ماما", "پسرخاله", "دوست", "خواهر زاده", "برادر زاده"];

export default function NabilAcademyUltimate() {
  const [activeTab, setActiveTab] = useState("register");
  const [patients, setPatients] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    name: "", fatherName: "", lastName: "", age: "", province: "کابل", phone: "", visitDate: "", nextVisit: "",
    attendantName: "", attendantPhone: "", relation: "پدر",
    bp: "", pulse: "", ox: "", temp: "",
    servicePrice: 0, labName: "", labType: "", labUnits: 0, labUnitPrice: 0, otherCosts: 0
  });

  useEffect(() => {
    const savedPatients = localStorage.getItem("nabil_patients_v8");
    const savedExpenses = localStorage.getItem("nabil_expenses_v8");
    if (savedPatients) setPatients(JSON.parse(savedPatients));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  const savePatient = () => {
    const totalLab = form.labUnits * form.labUnitPrice;
    const netProfit = form.servicePrice - totalLab - form.otherCosts;
    const ownerShare = netProfit * 0.25;
    const doctorsSplit = (netProfit - ownerShare) / 2;

    const newPatient = {
      ...form,
      id: Math.floor(Math.random() * 10000),
      totalLab,
      ownerShare,
      drNabilShare: doctorsSplit,
      drMahfouzShare: doctorsSplit
    };

    const updated = [newPatient, ...patients];
    setPatients(updated);
    localStorage.setItem("nabil_patients_v8", JSON.stringify(updated));
    alert("پرونده با موفقیت ثبت و محاسبات انجام شد.");
    setActiveTab("list");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-right text-slate-900 font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-full w-64 bg-white shadow-2xl p-6 hidden md:block border-l-4 border-blue-700">
        <h2 className="text-xl font-black text-blue-900 mb-8 border-b pb-4">آکادمی دندان‌پزشکی نبیل</h2>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab("register")} className={`w-full p-4 rounded-xl font-bold ${activeTab==='register'?'bg-blue-700 text-white':'hover:bg-blue-50'}`}>ثبت مریض و معاینات</button>
          <button onClick={() => setActiveTab("list")} className={`w-full p-4 rounded-xl font-bold ${activeTab==='list'?'bg-blue-700 text-white':'hover:bg-blue-50'}`}>لیست و جستجو</button>
          <button onClick={() => setActiveTab("nextVisits")} className={`w-full p-4 rounded-xl font-bold ${activeTab==='nextVisits'?'bg-blue-700 text-white':'hover:bg-blue-50'}`}>نوبت‌های بعدی</button>
        </nav>
      </aside>

      <main className="md:mr-64 p-8">
        {activeTab === "register" && (
          <div className="max-w-5xl mx-auto space-y-6">
            <section className="bg-white p-8 rounded-3xl shadow-sm">
              <h3 className="text-lg font-black mb-6 text-blue-800 border-r-4 border-blue-600 pr-3">۱. مشخصات مریض و پایواز</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input placeholder="نام" className="p-3 border rounded-xl" onChange={e=>setForm({...form, name:e.target.value})} />
                <input placeholder="تخلص" className="p-3 border rounded-xl" onChange={e=>setForm({...form, lastName:e.target.value})} />
                <select className="p-3 border rounded-xl" onChange={e=>setForm({...form, province:e.target.value})}>
                  {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input placeholder="شماره تماس" className="p-3 border rounded-xl" onChange={e=>setForm({...form, phone:e.target.value})} />
                <input placeholder="نام پایواز" className="p-3 border rounded-xl bg-slate-50" onChange={e=>setForm({...form, attendantName:e.target.value})} />
                <select className="p-3 border rounded-xl bg-slate-50" onChange={e=>setForm({...form, relation:e.target.value})}>
                  {relations.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input placeholder="تاریخ مراجعه بعدی" type="date" className="p-3 border rounded-xl bg-yellow-50" onChange={e=>setForm({...form, nextVisit:e.target.value})} />
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm">
              <h3 className="text-lg font-black mb-6 text-green-800 border-r-4 border-green-600 pr-3">۲. معاینات و لابراتوار</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <input placeholder="فشار خون" className="p-3 border rounded-xl" onChange={e=>setForm({...form, bp:e.target.value})} />
                <input placeholder="نبض" className="p-3 border rounded-xl" onChange={e=>setForm({...form, pulse:e.target.value})} />
                <input placeholder="O2 خون" className="p-3 border rounded-xl" onChange={e=>setForm({...form, ox:e.target.value})} />
                <input placeholder="حرارت" className="p-3 border rounded-xl" onChange={e=>setForm({...form, temp:e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl">
                <input placeholder="نام لابراتوار" className="p-3 border rounded-xl" onChange={e=>setForm({...form, labName:e.target.value})} />
                <input placeholder="تعداد واحد" type="number" className="p-3 border rounded-xl" onChange={e=>setForm({...form, labUnits:Number(e.target.value)})} />
                <input placeholder="قیمت فی واحد" type="number" className="p-3 border rounded-xl" onChange={e=>setForm({...form, labUnitPrice:Number(e.target.value)})} />
                <div className="p-3 font-bold text-red-600">کل لابراتوار: {(form.labUnits * form.labUnitPrice).toLocaleString()}</div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm">
              <h3 className="text-lg font-black mb-6 text-orange-800 border-r-4 border-orange-600 pr-3">۳. هزینه نهایی</h3>
              <div className="flex gap-4 items-center">
                <input placeholder="کل پول دریافتی از مریض" type="number" className="p-4 border-2 border-blue-600 rounded-2xl text-2xl font-black w-1/2" onChange={e=>setForm({...form, servicePrice:Number(e.target.value)})} />
                <input placeholder="سایر مصارف (نان/مواد)" type="number" className="p-4 border rounded-2xl w-1/2" onChange={e=>setForm({...form, otherCosts:Number(e.target.value)})} />
              </div>
              <button onClick={savePatient} className="w-full mt-8 bg-blue-800 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-900 transition-all">ثبت پرونده و محاسبه سهم اساتید</button>
            </section>
          </div>
        )}

        {activeTab === "list" && (
          <div className="space-y-4">
            <input placeholder="🔍 جستجو بر اساس نام، آیدی یا شماره تماس مریض..." className="w-full p-5 rounded-2xl shadow-sm border-none focus:ring-2 ring-blue-600 outline-none" onChange={e=>setSearchTerm(e.target.value)} />
            {patients.filter(p => p.name.includes(searchTerm) || p.phone.includes(searchTerm) || p.id.toString().includes(searchTerm)).map(p => (
              <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="font-black text-xl">{p.name} {p.lastName} <span className="text-sm text-slate-400">(ID: {p.id})</span></h4>
                  <p className="text-blue-600 font-bold">{p.phone} | {p.province}</p>
                  <p className="text-xs text-slate-500">فشار: {p.bp} | نبض: {p.pulse} | اکسیجن: {p.ox}</p>
                </div>
                <div className="text-left space-y-1 bg-slate-50 p-4 rounded-2xl border border-dashed">
                  <p className="text-xs font-bold">سهم دکتر محمد نادر: <span className="text-green-600 text-base">{p.drNabilShare.toLocaleString()}</span></p>
                  <p className="text-xs font-bold">سهم دکتر محفوظ: <span className="text-green-600 text-base">{p.drMahfouzShare.toLocaleString()}</span></p>
                  <p className="text-[10px] text-red-400">سهم مالک (۲۵٪): {p.ownerShare.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "nextVisits" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-black mb-6">مریضان نوبت بعدی</h3>
            <div className="grid gap-4">
              {patients.filter(p => p.nextVisit).map(p => (
                <div key={p.id} className="flex justify-between items-center p-4 border-b">
                  <span className="font-bold">{p.name} {p.lastName}</span>
                  <span className="text-red-600 font-black">{p.nextVisit}</span>
                  <a href={`https://wa.me/${p.phone}?text=سلام ${p.name} عزیز، نوبت بعدی شما در آکادمی نبیل به تاریخ ${p.nextVisit} است.`} className="bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold">ارسال واتساپ</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
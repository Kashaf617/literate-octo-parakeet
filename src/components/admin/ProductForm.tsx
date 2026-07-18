"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import { Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";

interface Category { id: string; name: string }
interface Collection { id: string; name: string; color: string }

export interface CompRow {
  label: string;
  ourValue: string;
  comp1Value: string;
  comp2Value: string;
}

export interface HowStep {
  title: string;
  desc: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProductFormValues {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  comparePrice: string;
  costPrice: string;
  sku: string;
  stock: string;
  images: string[];
  categoryId: string;
  collectionIds: string[];
  status: string;
  isFeatured: boolean;
  hasVariants: boolean;
  options: { name: string; values: string[] }[];
  variants: { sku: string; price: string; stock: string; optionChoices: Record<string, string>; image?: string | null }[];
  seoTitle: string;
  seoDescription: string;

  // Custom premium sections toggles
  showBundleSave: boolean;
  showComparison: boolean;
  showHowItWorks: boolean;
  showFaqs: boolean;

  // Structured fields
  descContent: string;
  descIngredients: string;
  descHowToUse: string;
  descBenefits: string;
  descTagline: string;

  // Comparison section
  compTitle: string;
  compSubtitle: string;
  compOurBrand: string;
  compCompetitor1: string;
  compCompetitor2: string;
  compRows: CompRow[];

  // How it works section
  howTitle: string;
  howSubtitle: string;
  howSteps: HowStep[];

  // FAQs section
  faqs: FaqItem[];
}

export default function ProductForm({
  categories,
  collections,
  initial
}: {
  categories: Category[];
  collections: Collection[];
  initial?: Partial<ProductFormValues>;
}) {
  const router = useRouter();
  
  // Safely parse initial JSON description if exists
  let parsedDesc: any = {};
  try {
    if (initial?.description) {
      parsedDesc = JSON.parse(initial.description);
    }
  } catch {
    parsedDesc = {};
  }

  const [values, setValues] = useState<ProductFormValues>({
    name: initial?.name || "",
    slug: initial?.slug || "",
    description: initial?.description || "",
    price: initial?.price?.toString() || "",
    comparePrice: initial?.comparePrice?.toString() || "",
    costPrice: initial?.costPrice?.toString() || "",
    sku: initial?.sku || "",
    stock: initial?.stock?.toString() || "0",
    images: initial?.images || [],
    categoryId: initial?.categoryId || "",
    collectionIds: initial?.collectionIds || [],
    status: initial?.status || "active",
    isFeatured: initial?.isFeatured || false,
    hasVariants: initial?.hasVariants || false,
    options: initial?.options || [],
    variants: initial?.variants || [],
    seoTitle: initial?.seoTitle || "",
    seoDescription: initial?.seoDescription || "",
    id: initial?.id,

    // Premium custom sections
    showBundleSave: parsedDesc.showBundleSave || false,
    showComparison: parsedDesc.showComparison || false,
    showHowItWorks: parsedDesc.showHowItWorks || false,
    showFaqs: parsedDesc.showFaqs || false,

    // Structured fields
    descContent: parsedDesc.content || initial?.description || "",
    descIngredients: parsedDesc.ingredients || "",
    descHowToUse: parsedDesc.howToUse || "",
    descBenefits: Array.isArray(parsedDesc.benefits) ? parsedDesc.benefits.join(", ") : "",
    descTagline: parsedDesc.tagline || "",

    // Comparison section
    compTitle: parsedDesc.compTitle || "WHY CHOOSE US",
    compSubtitle: parsedDesc.compSubtitle || "Premium quality at the best price",
    compOurBrand: parsedDesc.compOurBrand || "DEVINE ORA",
    compCompetitor1: parsedDesc.compCompetitor1 || "OTHERS",
    compCompetitor2: parsedDesc.compCompetitor2 || "CHEAP KNOCKOFFS",
    compRows: parsedDesc.compRows || [
      { label: "Quality", ourValue: "✓", comp1Value: "X", comp2Value: "X" },
      { label: "Fast Delivery", ourValue: "✓", comp1Value: "X", comp2Value: "✓" }
    ],

    // How it works section
    howTitle: parsedDesc.howTitle || "How It Works",
    howSubtitle: parsedDesc.howSubtitle || "Follow these simple steps to get started",
    howSteps: parsedDesc.howSteps || [
      { title: "Apply to Wet Hair", desc: "Apply the shampoo evenly from roots to tips." },
      { title: "Massage Gently", desc: "Massage the shampoo into your scalp and hair for 2-3 minutes to activate the color formula." }
    ],

    // FAQs section
    faqs: parsedDesc.faqs || [
      { question: "Do I need a patch test?", answer: "Yes — do a 24-hour patch test before first use." }
    ]
  });

  const [saving, setSaving] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [localCollections, setLocalCollections] = useState(collections);

  // Auto-generate variants when options change
  useEffect(() => {
    if (!values.hasVariants || values.options.length === 0) return;
    if (values.options.every(o => o.values.length === 0)) return;

    const generateCombinations = (options: {name: string; values: string[]}[]) => {
      let results: Record<string, string>[] = [{}];
      for (const opt of options) {
        if (opt.values.length === 0) continue;
        const newResults: Record<string, string>[] = [];
        for (const res of results) {
          for (const val of opt.values) {
            newResults.push({ ...res, [opt.name]: val });
          }
        }
        results = newResults;
      }
      return results;
    };

    const combinations = generateCombinations(values.options);
    
    const newVariants = combinations.map(combo => {
      const existing = values.variants.find(v => JSON.stringify(v.optionChoices) === JSON.stringify(combo));
      if (existing) return existing;
      return { sku: "", price: values.price || "0", stock: values.stock || "0", optionChoices: combo, image: null };
    });

    setValues(prev => ({ ...prev, variants: newVariants }));
  }, [values.options, values.hasVariants]);

  function toggleCollection(id: string) {
    if (values.collectionIds.includes(id)) {
      setValues({ ...values, collectionIds: values.collectionIds.filter(x => x !== id) });
    } else {
      setValues({ ...values, collectionIds: [...values.collectionIds, id] });
    }
  }

  async function createCollectionInline() {
    if (!newCollectionName) return;
    const res = await fetch("/api/admin/collections", {
      method: "POST",
      body: JSON.stringify({ name: newCollectionName })
    });
    if (res.ok) {
      const coll = await res.json();
      setLocalCollections([...localCollections, coll]);
      setValues({ ...values, collectionIds: [...values.collectionIds, coll.id] });
      setNewCollectionName("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const url = values.id ? `/api/admin/products/${values.id}` : "/api/admin/products";
    const method = values.id ? "PUT" : "POST";

    // Format description as a structured JSON object
    const structuredDesc = {
      content: values.descContent,
      ingredients: values.descIngredients,
      howToUse: values.descHowToUse,
      benefits: values.descBenefits ? values.descBenefits.split(",").map(b => b.trim()).filter(Boolean) : [],
      showBundleSave: values.showBundleSave,
      showComparison: values.showComparison,
      showHowItWorks: values.showHowItWorks,
      showFaqs: values.showFaqs,
      tagline: values.descTagline,
      
      // comparison payload
      compTitle: values.compTitle,
      compSubtitle: values.compSubtitle,
      compOurBrand: values.compOurBrand,
      compCompetitor1: values.compCompetitor1,
      compCompetitor2: values.compCompetitor2,
      compRows: values.compRows,

      // how it works payload
      howTitle: values.howTitle,
      howSubtitle: values.howSubtitle,
      howSteps: values.howSteps,

      // faqs payload
      faqs: values.faqs
    };

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        images: values.images.filter(Boolean),
        description: JSON.stringify(structuredDesc),
        price: parseFloat(values.price || "0"),
        comparePrice: values.comparePrice ? parseFloat(values.comparePrice) : null,
        costPrice: values.costPrice ? parseFloat(values.costPrice) : null,
        stock: parseInt(values.stock || "0", 10),
      })
    });

    setSaving(false);
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      const errData = await res.json().catch(() => ({}));
      alert(`Failed to save product (${res.status}): ${errData.error || "Unknown error"}`);
    }
  }

  // Row Management Functions
  const addCompRow = () => setValues({ ...values, compRows: [...values.compRows, { label: "", ourValue: "", comp1Value: "", comp2Value: "" }] });
  const updateCompRow = (index: number, field: keyof CompRow, val: string) => {
    const newRows = [...values.compRows];
    newRows[index][field] = val;
    setValues({ ...values, compRows: newRows });
  };
  const removeCompRow = (index: number) => setValues({ ...values, compRows: values.compRows.filter((_, i) => i !== index) });

  const addHowStep = () => setValues({ ...values, howSteps: [...values.howSteps, { title: "", desc: "" }] });
  const updateHowStep = (index: number, field: keyof HowStep, val: string) => {
    const newSteps = [...values.howSteps];
    newSteps[index][field] = val;
    setValues({ ...values, howSteps: newSteps });
  };
  const removeHowStep = (index: number) => setValues({ ...values, howSteps: values.howSteps.filter((_, i) => i !== index) });

  const addFaq = () => setValues({ ...values, faqs: [...values.faqs, { question: "", answer: "" }] });
  const updateFaq = (index: number, field: keyof FaqItem, val: string) => {
    const newFaqs = [...values.faqs];
    newFaqs[index][field] = val;
    setValues({ ...values, faqs: newFaqs });
  };
  const removeFaq = (index: number) => setValues({ ...values, faqs: values.faqs.filter((_, i) => i !== index) });


  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6 items-start pb-20">
      <div className="lg:col-span-2 space-y-5">
        <div className="admin-card space-y-4">
          <h3 className="font-extrabold text-ink">Basic Details</h3>
          <div>
            <label className="admin-label">Product Name *</label>
            <input className="admin-input" required value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} placeholder="e.g. Premium White T-Shirt" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">SKU</label>
              <input className="admin-input" value={values.sku} onChange={(e) => setValues({ ...values, sku: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Slug</label>
              <input className="admin-input" value={values.slug} onChange={(e) => setValues({ ...values, slug: e.target.value })} placeholder="Leave empty to auto-generate" />
            </div>
          </div>
          <div>
            <label className="admin-label">Product Tagline / Subtitle (Shown on PDP)</label>
            <input className="admin-input" value={values.descTagline} onChange={(e) => setValues({ ...values, descTagline: e.target.value })} placeholder="e.g. THE EASIEST WAY TO COVER GRAYS NATURALLY" />
          </div>
        </div>

        <div className="admin-card space-y-4">
          <h3 className="font-extrabold text-ink">Product Details & Specifications</h3>
          <div>
            <label className="admin-label">Main Description Content *</label>
            <textarea className="admin-input" required rows={4} value={values.descContent} onChange={(e) => setValues({ ...values, descContent: e.target.value })} placeholder="General product description..." />
          </div>
          <div>
            <label className="admin-label">Ingredients / Materials</label>
            <textarea className="admin-input" rows={2} value={values.descIngredients} onChange={(e) => setValues({ ...values, descIngredients: e.target.value })} placeholder="e.g. Olive Oil, Keratin, Aloe Vera..." />
          </div>
          <div>
            <label className="admin-label">How to Use / Directions</label>
            <textarea className="admin-input" rows={3} value={values.descHowToUse} onChange={(e) => setValues({ ...values, descHowToUse: e.target.value })} placeholder="Step-by-step instructions..." />
          </div>
          <div>
            <label className="admin-label">Key Benefits (Comma separated)</label>
            <input className="admin-input" value={values.descBenefits} onChange={(e) => setValues({ ...values, descBenefits: e.target.value })} placeholder="e.g. 100% Grey coverage, Ammonia free, Keratin Infused" />
          </div>
        </div>

        <div className="admin-card space-y-4">
          <h3 className="font-extrabold text-ink">Storefront Theme Sections</h3>
          <p className="text-xs text-sub -mt-2 mb-2">Enable high-converting widgets on this product detail page.</p>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold p-3 border rounded-lg bg-gray-50 border-line cursor-pointer select-none">
              <input type="checkbox" checked={values.showBundleSave} onChange={(e) => setValues({ ...values, showBundleSave: e.target.checked })} />
              Enable BUNDLE & SAVE
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold p-3 border rounded-lg bg-gray-50 border-line cursor-pointer select-none">
              <input type="checkbox" checked={values.showComparison} onChange={(e) => setValues({ ...values, showComparison: e.target.checked })} />
              Enable Comparison Table
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold p-3 border rounded-lg bg-gray-50 border-line cursor-pointer select-none">
              <input type="checkbox" checked={values.showHowItWorks} onChange={(e) => setValues({ ...values, showHowItWorks: e.target.checked })} />
              Enable How It Works Blocks
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold p-3 border rounded-lg bg-gray-50 border-line cursor-pointer select-none">
              <input type="checkbox" checked={values.showFaqs} onChange={(e) => setValues({ ...values, showFaqs: e.target.checked })} />
              Enable FAQs Section
            </label>
          </div>

          {/* Dynamic Forms for enabled sections */}
          
          {values.showComparison && (
            <div className="mt-6 p-5 border rounded-xl bg-gray-50/50 space-y-5">
              <h4 className="font-extrabold text-sm text-ink border-b pb-2">Comparison Table Content</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label text-[11px]">Section Title</label>
                  <input className="admin-input bg-white" value={values.compTitle} onChange={(e) => setValues({ ...values, compTitle: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label text-[11px]">Section Subtitle</label>
                  <input className="admin-input bg-white" value={values.compSubtitle} onChange={(e) => setValues({ ...values, compSubtitle: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="admin-label text-[11px] text-green-700">Our Brand Column</label>
                  <input className="admin-input bg-white" value={values.compOurBrand} onChange={(e) => setValues({ ...values, compOurBrand: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label text-[11px]">Competitor 1 Column</label>
                  <input className="admin-input bg-white" value={values.compCompetitor1} onChange={(e) => setValues({ ...values, compCompetitor1: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label text-[11px]">Competitor 2 Column</label>
                  <input className="admin-input bg-white" value={values.compCompetitor2} onChange={(e) => setValues({ ...values, compCompetitor2: e.target.value })} />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="admin-label text-[11px]">Table Rows (Features vs Values)</label>
                {values.compRows.map((row, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-white p-2 rounded-lg border">
                    <input placeholder="Row Label (e.g. Cost)" className="admin-input h-9 text-xs flex-1" value={row.label} onChange={(e) => updateCompRow(idx, 'label', e.target.value)} />
                    <input placeholder="Our Value" className="admin-input h-9 text-xs flex-1 border-green-200 bg-green-50/30" value={row.ourValue} onChange={(e) => updateCompRow(idx, 'ourValue', e.target.value)} />
                    <input placeholder="Comp 1 Value" className="admin-input h-9 text-xs flex-1" value={row.comp1Value} onChange={(e) => updateCompRow(idx, 'comp1Value', e.target.value)} />
                    <input placeholder="Comp 2 Value" className="admin-input h-9 text-xs flex-1" value={row.comp2Value} onChange={(e) => updateCompRow(idx, 'comp2Value', e.target.value)} />
                    <button type="button" onClick={() => removeCompRow(idx)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                  </div>
                ))}
                <button type="button" onClick={addCompRow} className="text-[12px] font-bold text-brand flex items-center gap-1 mt-2"><Plus size={14}/> Add Row</button>
              </div>
            </div>
          )}

          {values.showHowItWorks && (
            <div className="mt-6 p-5 border rounded-xl bg-gray-50/50 space-y-5">
              <h4 className="font-extrabold text-sm text-ink border-b pb-2">How It Works Content</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label text-[11px]">Section Title</label>
                  <input className="admin-input bg-white" value={values.howTitle} onChange={(e) => setValues({ ...values, howTitle: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label text-[11px]">Section Subtitle</label>
                  <input className="admin-input bg-white" value={values.howSubtitle} onChange={(e) => setValues({ ...values, howSubtitle: e.target.value })} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="admin-label text-[11px]">Steps</label>
                {values.howSteps.map((step, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border space-y-2 relative pr-10">
                    <input placeholder="Step Title (e.g. Apply to Wet Hair)" className="admin-input font-bold" value={step.title} onChange={(e) => updateHowStep(idx, 'title', e.target.value)} />
                    <textarea placeholder="Step Description..." className="admin-input text-xs" rows={2} value={step.desc} onChange={(e) => updateHowStep(idx, 'desc', e.target.value)} />
                    <button type="button" onClick={() => removeHowStep(idx)} className="text-red-500 absolute right-3 top-1/2 -translate-y-1/2 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                  </div>
                ))}
                <button type="button" onClick={addHowStep} className="text-[12px] font-bold text-brand flex items-center gap-1 mt-2"><Plus size={14}/> Add Step</button>
              </div>
            </div>
          )}

          {values.showFaqs && (
            <div className="mt-6 p-5 border rounded-xl bg-gray-50/50 space-y-5">
              <h4 className="font-extrabold text-sm text-ink border-b pb-2">FAQs Content</h4>
              <div className="space-y-3">
                <label className="admin-label text-[11px]">Questions & Answers</label>
                {values.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border space-y-2 relative pr-10">
                    <input placeholder="Question (e.g. Do I need a patch test?)" className="admin-input font-bold" value={faq.question} onChange={(e) => updateFaq(idx, 'question', e.target.value)} />
                    <textarea placeholder="Answer..." className="admin-input text-xs" rows={2} value={faq.answer} onChange={(e) => updateFaq(idx, 'answer', e.target.value)} />
                    <button type="button" onClick={() => removeFaq(idx)} className="text-red-500 absolute right-3 top-1/2 -translate-y-1/2 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                  </div>
                ))}
                <button type="button" onClick={addFaq} className="text-[12px] font-bold text-brand flex items-center gap-1 mt-2"><Plus size={14}/> Add Question</button>
              </div>
            </div>
          )}
        </div>

        <div className="admin-card space-y-4">
          <h3 className="font-extrabold text-ink font-sans">Media Gallery</h3>
          <p className="text-xs text-sub -mt-2 mb-2 font-sans">
            Upload up to 4 images directly from your PC. Drag and drop or click each slot to select files. The first image will be used as the main product thumbnail.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0, 1, 2, 3].map((idx) => {
              const label = idx === 0 ? "Main Image (Required)" : `Gallery Image ${idx + 1}`;
              const value = values.images[idx] || "";
              return (
                <div key={idx} className="border border-line rounded-xl p-4 bg-gray-50/50 relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-ink uppercase tracking-wider font-sans">{label}</span>
                    <div className="flex items-center gap-1.5">
                      {value && idx > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = [...values.images];
                            const temp = newImages[idx];
                            newImages[idx] = newImages[idx - 1] || "";
                            newImages[idx - 1] = temp;
                            setValues({ ...values, images: newImages });
                          }}
                          className="p-1 hover:bg-gray-200 rounded text-gray-600"
                          title="Move Left / Up"
                        >
                          <ArrowUp size={14} className="rotate-[-90deg] md:rotate-0" />
                        </button>
                      )}
                      {value && idx < 3 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = [...values.images];
                            const temp = newImages[idx];
                            newImages[idx] = newImages[idx + 1] || "";
                            newImages[idx + 1] = temp;
                            setValues({ ...values, images: newImages });
                          }}
                          className="p-1 hover:bg-gray-200 rounded text-gray-600"
                          title="Move Right / Down"
                        >
                          <ArrowDown size={14} className="rotate-[-90deg] md:rotate-0" />
                        </button>
                      )}
                      {value && (
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = [...values.images];
                            newImages[idx] = "";
                            setValues({ ...values, images: newImages });
                          }}
                          className="p-1 hover:bg-red-100 text-red-500 rounded"
                          title="Delete Image"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <ImageUploader
                    label=""
                    value={value}
                    onChange={(url) => {
                      const newImages = [...values.images];
                      newImages[idx] = url;
                      setValues({ ...values, images: newImages });
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="admin-card space-y-4">
          <h3 className="font-extrabold text-ink">Pricing & Inventory</h3>
          {!values.hasVariants && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="admin-label">Price (PKR) *</label>
                  <input type="number" step="0.01" className="admin-input" required={!values.hasVariants} value={values.price} onChange={(e) => setValues({ ...values, price: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Compare-at Price</label>
                  <input type="number" step="0.01" className="admin-input" value={values.comparePrice} onChange={(e) => setValues({ ...values, comparePrice: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Cost Price</label>
                  <input type="number" step="0.01" className="admin-input" value={values.costPrice} onChange={(e) => setValues({ ...values, costPrice: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="admin-label">Stock Quantity *</label>
                <input type="number" className="admin-input" required={!values.hasVariants} value={values.stock} onChange={(e) => setValues({ ...values, stock: e.target.value })} />
              </div>
            </>
          )}

          <div className="pt-4 border-t border-line">
            <label className="flex items-center gap-2 text-sm font-semibold mb-4 cursor-pointer select-none">
              <input type="checkbox" checked={values.hasVariants} onChange={(e) => setValues({ ...values, hasVariants: e.target.checked })} />
              This product has options, like size or color
            </label>

            {values.hasVariants && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {values.options.map((opt, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-line">
                      <div className="flex justify-between items-center mb-3">
                        <input 
                          className="admin-input w-1/3 bg-white" 
                          placeholder="Option name (e.g. Size)" 
                          value={opt.name} 
                          onChange={(e) => {
                            const newOpts = [...values.options];
                            newOpts[idx].name = e.target.value;
                            setValues({ ...values, options: newOpts });
                          }} 
                        />
                        <button type="button" onClick={() => {
                          const newOpts = values.options.filter((_, i) => i !== idx);
                          setValues({ ...values, options: newOpts });
                        }} className="text-red-500 p-2"><Trash2 size={16}/></button>
                      </div>
                      <div>
                        <label className="admin-label text-[10px]">Option Values (Comma separated)</label>
                        <input 
                          className="admin-input bg-white" 
                          placeholder="e.g. Small, Medium, Large" 
                          value={opt.values.join(", ")}
                          onChange={(e) => {
                            const vals = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                            const newOpts = [...values.options];
                            newOpts[idx].values = vals;
                            setValues({ ...values, options: newOpts });
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                  
                  <button type="button" onClick={() => setValues({ ...values, options: [...values.options, { name: "", values: [] }] })} className="text-[13px] font-bold text-brand flex items-center gap-1">
                    <Plus size={16} /> Add another option
                  </button>
                </div>

                {values.variants.length > 0 && (
                  <div>
                    <h4 className="font-bold text-sm text-ink mb-3">Generated Variants</h4>
                    <div className="overflow-x-auto border border-line rounded-lg">
                      <table className="w-full text-left text-[13px]">
                        <thead className="bg-gray-50 border-b border-line">
                          <tr>
                            <th className="p-3 font-semibold text-sub">Variant</th>
                            <th className="p-3 font-semibold text-sub w-24">Price</th>
                            <th className="p-3 font-semibold text-sub w-20">Stock</th>
                            <th className="p-3 font-semibold text-sub w-28">SKU</th>
                            <th className="p-3 font-semibold text-sub w-36">Image</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                          {values.variants.map((v, i) => (
                            <tr key={i}>
                              <td className="p-3 font-medium text-ink">
                                {Object.values(v.optionChoices).join(" / ")}
                              </td>
                              <td className="p-2">
                                <input className="admin-input p-1.5 h-8 text-xs" type="number" required value={v.price} onChange={(e) => {
                                  const newVars = [...values.variants];
                                  newVars[i].price = e.target.value;
                                  setValues({ ...values, variants: newVars });
                                }} />
                              </td>
                              <td className="p-2">
                                <input className="admin-input p-1.5 h-8 text-xs" type="number" required value={v.stock} onChange={(e) => {
                                  const newVars = [...values.variants];
                                  newVars[i].stock = e.target.value;
                                  setValues({ ...values, variants: newVars });
                                }} />
                              </td>
                              <td className="p-2">
                                <input className="admin-input p-1.5 h-8 text-xs" placeholder="SKU" value={v.sku} onChange={(e) => {
                                  const newVars = [...values.variants];
                                  newVars[i].sku = e.target.value;
                                  setValues({ ...values, variants: newVars });
                                }} />
                              </td>
                              <td className="p-2 flex items-center gap-1.5">
                                {v.image && (
                                  <div className="relative w-8 h-8 rounded border border-line overflow-hidden shrink-0">
                                    <img src={v.image} alt="" className="object-cover w-full h-full" />
                                  </div>
                                )}
                                <select 
                                  className="admin-select p-1 h-8 text-xs bg-white min-w-[70px] flex-1" 
                                  value={v.image || ""} 
                                  onChange={(e) => {
                                    const newVars = [...values.variants];
                                    newVars[i].image = e.target.value || null;
                                    setValues({ ...values, variants: newVars });
                                  }}
                                >
                                  <option value="">— None —</option>
                                  {values.images.filter(Boolean).map((img, idx) => (
                                    <option key={img} value={img}>Img {idx + 1}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="admin-card space-y-4">
          <h3 className="font-extrabold text-ink">Search Engine Optimization</h3>
          <div>
            <label className="admin-label">SEO Title</label>
            <input className="admin-input" value={values.seoTitle} onChange={(e) => setValues({ ...values, seoTitle: e.target.value })} placeholder={values.name} />
          </div>
          <div>
            <label className="admin-label">SEO Meta Description</label>
            <textarea className="admin-input" rows={2} value={values.seoDescription} onChange={(e) => setValues({ ...values, seoDescription: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="admin-card space-y-4">
          <h3 className="font-extrabold text-ink">Organize</h3>
          <div>
            <label className="admin-label">Status</label>
            <select className="admin-select" value={values.status} onChange={(e) => setValues({ ...values, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Category</label>
            <select className="admin-select" value={values.categoryId} onChange={(e) => setValues({ ...values, categoryId: e.target.value })}>
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer select-none">
            <input type="checkbox" checked={values.isFeatured} onChange={(e) => setValues({ ...values, isFeatured: e.target.checked })} />
            Featured product
          </label>
        </div>

        <div className="admin-card space-y-3">
          <h3 className="font-extrabold text-ink">Collections</h3>
          <p className="text-xs text-sub -mt-2">e.g. Beauty Essentials Sale, The Best Offers, New Goods</p>
          <div className="space-y-2">
            {localCollections.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm font-semibold cursor-pointer select-none">
                <input type="checkbox" checked={values.collectionIds.includes(c.id)} onChange={() => toggleCollection(c.id)} />
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: c.color }} />
                {c.name}
              </label>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <input className="admin-input" placeholder="New collection name" value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} />
            <button type="button" onClick={createCollectionInline} className="btn-secondary shrink-0 px-3">Add</button>
          </div>
        </div>

        <button disabled={saving} className="btn-primary w-full justify-center py-3">
          {saving ? "Saving..." : values.id ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}

// // import { useEffect, useState } from "react";
// // import { motion } from "framer-motion";
// // import { useNavigate } from "react-router-dom";
// // import { Droplets, Thermometer, Wind, Zap, FlaskConical, Gauge, Sprout, AlertCircle, Loader2, TrendingUp, Mic, Leaf } from "lucide-react";
// // import { useLanguage } from "@/contexts/LanguageContext";
// // import { MetricCard } from "@/components/MetricCard";
// // import { sensorService, type SensorReading } from "@/services/sensorService";
// // import { chatService, type CropRecommendationItem } from "@/services/chatService";
// // import { Alert, AlertDescription } from "@/components/ui/alert";
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import {
// //   RadarChart,
// //   Radar,
// //   PolarGrid,
// //   PolarAngleAxis,
// //   PolarRadiusAxis,
// //   ResponsiveContainer,
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// // } from "recharts";

// // const URDU_TRANSLATIONS: Record<string, string> = {
// //   // Phrases
// //   "within optimal range": "بہترین حد میں ہیں",
// //   "slightly outside ideal range": "مثالی حد سے تھوڑا باہر ہیں",
// //   "Conditions are broadly suitable.": "حالات مناسب ہیں۔",
// //   // Crops
// //   "Rice": "چاول",
// //   "Cotton": "کپاس",
// //   "Maize": "مکئی",
// //   "Sugarcane": "گنا",
// //   "Sorghum (Jowar)": "جوار",
// //   "Millet (Bajra)": "باجرہ",
// //   "Sesame (Til)": "تل",
// //   "Mung Bean (Moong)": "مونگ",
// //   "Moth Bean (Mash)": "ماش",
// //   "Wheat": "گندم",
// //   "Mustard (Sarson)": "سرسوں",
// //   "Chickpea (Chanay)": "چنے",
// //   "Lentil (Masoor)": "مسور",
// //   "Barley (Jau)": "جو",
// //   "Potato": "آلو",
// //   "Tomato": "ٹماٹر",
// //   "Onion (Pyaaz)": "پیاز",
// //   "Chilli": "مرچ",
// //   "Garlic (Lehsan)": "لہسن",
// //   "Spinach (Palak)": "پالک",
// //   "Sunflower": "سورج مکھی",
// //   "Canola (Toria)": "کینولا",
// //   "Groundnut (Mungphali)": "مونگ پھلی",
// //   // Parameters
// //   "pH": "پی ایچ",
// //   "Nitrogen": "نائٹروجن",
// //   "Phosphorus": "فاسفورس",
// //   "Potassium": "پوٹاشیم",
// //   "Humidity": "نمی",
// //   "Temperature": "درجہ حرارت",
// //   "EC": "ای سی",
// // };

// // const translateDynamicText = (text: string, lang: string) => {
// //   if (lang !== "ur" || !text) return text;
// //   let translated = text;
// //   Object.entries(URDU_TRANSLATIONS).forEach(([eng, ur]) => {
// //     const regex = new RegExp(eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
// //     translated = translated.replace(regex, ur);
// //   });
// //   return translated;
// // };

// // interface DisplayedSensorData {
// //   nitrogen: number;
// //   phosphorus: number;
// //   potassium: number;
// //   ph: number;
// //   soilTemp: number;
// //   humidity: number;
// //   ec: number;
// // }

// // const transformSensorData = (reading: SensorReading): DisplayedSensorData => ({
// //   nitrogen: reading.nitrogen,
// //   phosphorus: reading.phosphorus,
// //   potassium: reading.potassium,
// //   ph: reading.ph,
// //   soilTemp: reading.temperature,
// //   humidity: reading.humidity,
// //   ec: reading.ec,
// // });

// // const getStatus = (key: string, val: number): "good" | "optimal" | "high" | "low" | "moderate" => {
// //   if (key === "nitrogen") return val >= 200 && val <= 250 ? "optimal" : val < 200 ? "low" : "high";
// //   if (key === "phosphorus") return val >= 20 && val <= 30 ? "optimal" : val < 20 ? "low" : "high";
// //   if (key === "potassium") return val >= 150 && val <= 200 ? "optimal" : val < 150 ? "low" : "high";
// //   if (key === "ph") return val >= 6.0 && val <= 7.0 ? "optimal" : val < 6 ? "low" : "high";
// //   if (key === "soilTemp") return val >= 20 && val <= 30 ? "optimal" : val < 20 ? "low" : "high";
// //   if (key === "humidity") return val >= 40 && val <= 70 ? "good" : val < 40 ? "low" : "high";
// //   if (key === "ec") return val >= 800 && val <= 1500 ? "optimal" : val < 800 ? "low" : "high";
// //   return "good";
// // };

// // const calculateHealthScore = (data: DisplayedSensorData): number => {
// //   let score = 0;

// //   // Nitrogen score (Max 15)
// //   if (data.nitrogen >= 200 && data.nitrogen <= 250) score += 15;
// //   else if (data.nitrogen >= 150 && data.nitrogen <= 300) score += 10;
// //   else if (data.nitrogen > 0) score += 5;

// //   // Phosphorus score (Max 15)
// //   if (data.phosphorus >= 20 && data.phosphorus <= 30) score += 15;
// //   else if (data.phosphorus >= 15 && data.phosphorus <= 40) score += 10;
// //   else if (data.phosphorus > 0) score += 5;

// //   // Potassium score (Max 15)
// //   if (data.potassium >= 150 && data.potassium <= 200) score += 15;
// //   else if (data.potassium >= 100 && data.potassium <= 250) score += 10;
// //   else if (data.potassium > 0) score += 5;

// //   // pH score (Max 15)
// //   if (data.ph >= 6.0 && data.ph <= 7.0) score += 15;
// //   else if (data.ph >= 5.5 && data.ph <= 7.5) score += 10;
// //   else if (data.ph > 0) score += 5;

// //   // Temperature score (Max 10)
// //   if (data.soilTemp >= 20 && data.soilTemp <= 30) score += 10;
// //   else if (data.soilTemp >= 15 && data.soilTemp <= 35) score += 7;
// //   else if (data.soilTemp > 0) score += 3;

// //   // Humidity score (Max 15)
// //   if (data.humidity >= 40 && data.humidity <= 70) score += 15;
// //   else if (data.humidity >= 30 && data.humidity <= 80) score += 10;
// //   else if (data.humidity > 0) score += 5;

// //   // EC score (Max 15)
// //   if (data.ec >= 800 && data.ec <= 1500) score += 15;
// //   else if (data.ec >= 600 && data.ec <= 2000) score += 10;
// //   else if (data.ec > 0) score += 5;

// //   return Math.min(100, score);
// // };

// // // Prepare radar chart data
// // const prepareRadarData = (data: DisplayedSensorData) => {
// //   return [
// //     { name: "N", value: Math.min(100, (data.nitrogen / 300) * 100), fullMark: 100 },
// //     { name: "P", value: Math.min(100, (data.phosphorus / 40) * 100), fullMark: 100 },
// //     { name: "K", value: Math.min(100, (data.potassium / 250) * 100), fullMark: 100 },
// //     { name: "pH", value: Math.min(100, ((data.ph / 8) * 100)), fullMark: 100 },
// //     { name: "Temp", value: Math.min(100, ((data.soilTemp / 40) * 100)), fullMark: 100 },
// //     { name: "Humidity", value: data.humidity, fullMark: 100 },
// //     { name: "EC", value: Math.min(100, ((data.ec / 2000) * 100)), fullMark: 100 },
// //   ];
// // };

// // // Prepare comparison bar data
// // const prepareComparisonData = (data: DisplayedSensorData) => {
// //   return [
// //     { name: "Nitrogen", current: data.nitrogen, optimal: 225, max: 300 },
// //     { name: "Phosphorus", current: data.phosphorus, optimal: 25, max: 40 },
// //     { name: "Potassium", current: data.potassium, optimal: 175, max: 250 },
// //     { name: "pH", current: data.ph * 10, optimal: 65, max: 80 },
// //     { name: "Temperature", current: data.soilTemp, optimal: 25, max: 40 },
// //     { name: "Humidity", current: data.humidity, optimal: 55, max: 100 },
// //     { name: "EC", current: data.ec / 10, optimal: 115, max: 200 },
// //   ];
// // };

// // export default function Dashboard() {
// //   const { t, language } = useLanguage();
// //   const navigate = useNavigate();
// //   const [data, setData] = useState<DisplayedSensorData | null>(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   // Crop recommendations state
// //   const [cropRecs, setCropRecs] = useState<CropRecommendationItem[]>([]);
// //   const [cropSummary, setCropSummary] = useState<string>("");
// //   const [cropLoading, setCropLoading] = useState(true);
// //   const [cropError, setCropError] = useState<string | null>(null);

// //   const fetchSensorData = async () => {
// //     try {
// //       setIsLoading(true);
// //       setError(null);
// //       const reading = await sensorService.getLatest();
// //       setData(transformSensorData(reading));
// //     } catch (err) {
// //       setError(
// //         err instanceof Error
// //           ? err.message
// //           : t("failedToFetchData")
// //       );
// //       console.error("Failed to fetch sensor data:", err);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const fetchCropRecommendations = async () => {
// //     try {
// //       setCropLoading(true);
// //       setCropError(null);
// //       const res = await chatService.getCropRecommendations();
// //       setCropRecs(res.recommendations ?? []);
// //       setCropSummary(res.summary ?? "");
// //     } catch (err) {
// //       setCropError(err instanceof Error ? err.message : "Failed to load crop recommendations");
// //     } finally {
// //       setCropLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     // Fetch data immediately
// //     fetchSensorData();
// //     fetchCropRecommendations();

// //     // Set up interval to refresh data every 30 seconds
// //     const interval = setInterval(fetchSensorData, 30000);

// //     return () => clearInterval(interval);
// //   }, []);

// //   const metrics = [
// //     { key: "nitrogen", icon: Sprout, label: t("nitrogen"), value: data?.nitrogen || 0, unit: t("mgPerKg"), color: "bg-primary/10 text-primary" },
// //     { key: "phosphorus", icon: FlaskConical, label: t("phosphorus"), value: data?.phosphorus || 0, unit: t("mgPerKg"), color: "bg-info/10 text-info" },
// //     { key: "potassium", icon: Zap, label: t("potassium"), value: data?.potassium || 0, unit: t("mgPerKg"), color: "bg-warning/10 text-warning" },
// //     { key: "ph", icon: Gauge, label: t("ph"), value: data?.ph || 0, unit: "", color: "bg-accent text-accent-foreground" },
// //     { key: "soilTemp", icon: Thermometer, label: t("soilTemp"), value: data?.soilTemp || 0, unit: t("celsius"), color: "bg-destructive/10 text-destructive" },
// //     { key: "humidity", icon: Droplets, label: t("humidity"), value: data?.humidity || 0, unit: t("percent"), color: "bg-info/10 text-info" },
// //     { key: "ec", icon: Wind, label: t("ec"), value: data?.ec || 0, unit: t("msPerCm"), color: "bg-success/10 text-success" },
// //   ];

// //   const healthScore = data ? Math.round(calculateHealthScore(data)) : 0;

// //   return (
// //     <div className="max-w-7xl mx-auto relative z-10">

// //       {/* Loading State */}
// //       {isLoading && (
// //         <motion.div
// //           initial={{ opacity: 0 }}
// //           animate={{ opacity: 1 }}
// //           className="flex items-center justify-center py-12"
// //         >
// //           <Loader2 className="w-8 h-8 animate-spin text-primary" />
// //           <span className="ml-2 text-muted-foreground">{t("loadingSensorData")}</span>
// //         </motion.div>
// //       )}

// //       {/* Error State */}
// //       {error && (
// //         <motion.div
// //           initial={{ opacity: 0, y: -10 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           className="mb-6"
// //         >
// //           <Alert variant="destructive">
// //             <AlertCircle className="h-4 w-4" />
// //             <AlertDescription>
// //               {error}
// //             </AlertDescription>
// //           </Alert>
// //         </motion.div>
// //       )}

// //       {/* Content (only show when loaded) */}
// //       {!isLoading && data && (
// //         <>
// //           <motion.div
// //             initial={{ opacity: 0, y: -10 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             className="mb-4 sm:mb-6 lg:mb-8 px-0.5"
// //           >
// //             <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{t("sensorOverview")}</h1>
// //             <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{t("realTimeMonitoring")}</p>
// //           </motion.div>

// //           {/* Soil Health Score */}
// //           <motion.div
// //             initial={{ opacity: 0, y: 10 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             className="metric-card mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-card/90 backdrop-blur-md p-4 sm:p-6 rounded-lg"
// //           >
// //             <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
// //               <span className="text-2xl sm:text-3xl font-bold text-primary">{healthScore}</span>
// //             </div>
// //             <div className="flex-1">
// //               <h3 className="text-base sm:text-lg font-semibold text-foreground">{t("soilHealthScore")}</h3>
// //               <p className="text-xs sm:text-sm text-muted-foreground">
// //                 {healthScore >= 80 ? t("excellent") : healthScore >= 60 ? t("good") : t("needsImprovement")} - {t("realTimeMonitoring")}
// //               </p>
// //             </div>
// //             <div className="flex items-center gap-2 ml-auto sm:ml-0">
// //               <span className="live-dot" />
// //               <span className="text-xs font-semibold text-success uppercase tracking-wider">{t("live")}</span>
// //             </div>
// //           </motion.div>

// //           {/* AI Advisor CTA */}
// //           <motion.div
// //             initial={{ opacity: 0, y: 10 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ delay: 0.1 }}
// //             className="mb-8"
// //           >
// //             <Card
// //               className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 cursor-pointer hover:shadow-lg transition-shadow"
// //               onClick={() => navigate("/ai-advisor")}
// //             >
// //               <CardContent className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-4">
// //                 <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
// //                   <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-1 sm:mt-0">
// //                     <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
// //                   </div>
// //                   <div className="flex-1">
// //                     <h3 className="text-sm sm:text-base font-semibold text-foreground">{t("getAiRecommendationTitle")}</h3>
// //                     <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{t("getAiRecommendationDescription")}</p>
// //                   </div>
// //                 </div>
// //                 <div className="w-full sm:w-auto mt-2 sm:mt-0">
// //                   <Button
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       navigate("/ai-advisor");
// //                     }}
// //                     className="w-full sm:w-auto whitespace-nowrap text-xs sm:text-sm"
// //                   >
// //                     {t("openAiAdvisor")}
// //                   </Button>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </motion.div>

// //           {/* Metric Cards Grid */}
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
// //             {metrics.map((m, i) => (
// //               <MetricCard
// //                 key={m.key}
// //                 icon={m.icon}
// //                 label={m.label}
// //                 value={m.value}
// //                 unit={m.unit}
// //                 status={getStatus(m.key, m.value)}
// //                 color={m.color}
// //                 index={i}
// //               />
// //             ))}

// //             {/* 8th Card: Top 3 Recommended Crops — distinct premium card */}
// //             <motion.div
// //               initial={{ opacity: 0, y: 10 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ delay: metrics.length * 0.08 }}
// //               className="relative overflow-hidden rounded-xl border border-emerald-200 dark:border-emerald-900 shadow-md flex flex-col"
// //               style={{
// //                 background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)",
// //               }}
// //             >
// //               {/* Decorative blobs */}
// //               <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
// //               <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-teal-400/20 blur-xl pointer-events-none" />

// //               {/* Header strip */}
// //               <div className="relative flex items-center gap-2 px-4 pt-4 pb-2">
// //                 <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm shrink-0">
// //                   <Leaf className="w-4 h-4 text-white" />
// //                 </div>
// //                 <div>
// //                   <p className="text-[11px] font-bold text-emerald-900 leading-tight">
// //                     {t("topRecommendedCrops")}
// //                   </p>
// //                   <p className="text-[9px] text-emerald-700 font-medium">{t("basedOnLiveSensorData")}</p>
// //                 </div>
// //               </div>

// //               {/* Divider */}
// //               <div className="mx-4 h-px bg-emerald-200/70" />

// //               {/* Body */}
// //               <div className="relative flex-1 px-4 py-3 space-y-2">
// //                 {cropLoading ? (
// //                   <div className="flex items-center gap-2 text-emerald-700 text-xs py-1">
// //                     <Loader2 className="w-3 h-3 animate-spin" />
// //                     <span className="font-medium">{t("analyzingSoilData")}</span>
// //                   </div>
// //                 ) : cropError ? (
// //                   <div className="flex items-start gap-1.5">
// //                     <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
// //                     <p className="text-[10px] text-red-600 leading-tight">{cropError}</p>
// //                   </div>
// //                 ) : (
// //                   <>
// //                     {cropRecs.slice(0, 3).map((crop, idx) => {
// //                       const translatedName = translateDynamicText(crop.name, language);
// //                       const translatedReason = crop.reason ? translateDynamicText(crop.reason, language) : "";
// //                       const medals = ["🥇", "🥈", "🥉"];
// //                       const bgColors = [
// //                         "bg-yellow-100/80 border-yellow-300",
// //                         "bg-gray-100/80 border-gray-300",
// //                         "bg-orange-100/80 border-orange-300",
// //                       ];
// //                       return (
// //                         <div
// //                           key={crop.rank}
// //                           className={`flex items-start gap-2 rounded-lg border px-2.5 py-1.5 backdrop-blur-sm ${bgColors[idx]}`}
// //                         >
// //                           <span className="text-base leading-none mt-0.5">{medals[idx]}</span>
// //                           <div className="min-w-0">
// //                             <p className="text-[11px] font-bold text-gray-900 truncate">{translatedName}</p>
// //                             {translatedReason && (
// //                               <p className="text-[9px] text-gray-600 leading-tight line-clamp-1 mt-0.5">{translatedReason}</p>
// //                             )}
// //                           </div>
// //                         </div>
// //                       );
// //                     })}
// //                     {cropSummary && (
// //                       <p className="text-[9px] text-emerald-800 pt-1 leading-snug line-clamp-2 italic">
// //                         {translateDynamicText(cropSummary, language)}
// //                       </p>
// //                     )}
// //                   </>
// //                 )}
// //               </div>

// //               {/* CTA Button */}
// //               <div className="relative px-4 pb-4">
// //                 <button
// //                   onClick={() => navigate("/ai-advisor")}
// //                   className="w-full py-2 rounded-lg text-xs font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
// //                   style={{ background: "linear-gradient(90deg, #059669, #10b981)" }}
// //                 >
// //                   {t("getMoreInfo")}
// //                 </button>
// //               </div>
// //             </motion.div>
// //           </div>

// //           {/* Charts Section */}
// //           <motion.div
// //             initial={{ opacity: 0, y: 10 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ delay: 0.6 }}
// //             className="mt-8 sm:mt-12 space-y-4 sm:space-y-6"
// //           >
// //             <div className="flex items-center gap-2 mb-4 sm:mb-6">
// //               <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
// //               <h2 className="text-lg sm:text-xl font-bold text-foreground">{t("analytics")}</h2>
// //             </div>

// //             {/* Radar Chart - Metric Overview */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle className="text-base sm:text-lg">{t("sensorMetricsOverview")}</CardTitle>
// //                 <CardDescription className="text-xs sm:text-sm">{t("normalizedReadings")}</CardDescription>
// //               </CardHeader>
// //               <CardContent className="w-full overflow-x-auto">
// //                 <div className="min-h-[250px] sm:min-h-[320px] md:min-h-[400px] w-full">
// //                   <ResponsiveContainer width="100%" height={typeof window !== 'undefined' ? (window.innerWidth < 640 ? 250 : window.innerWidth < 768 ? 320 : 400) : 400}>
// //                     <RadarChart data={prepareRadarData(data)}>
// //                       <PolarGrid stroke="hsl(var(--muted-foreground))" opacity={0.2} />
// //                       <PolarAngleAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 12 }} />
// //                       <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
// //                       <Radar
// //                         name={t("current")}
// //                         dataKey="value"
// //                         stroke="hsl(var(--primary))"
// //                         fill="hsl(var(--primary))"
// //                         fillOpacity={0.6}
// //                       />
// //                     </RadarChart>
// //                   </ResponsiveContainer>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Bar Chart - Current vs Optimal */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle className="text-base sm:text-lg">{t("currentVsOptimalLevels")}</CardTitle>
// //                 <CardDescription className="text-xs sm:text-sm">{t("comparisonValues")}</CardDescription>
// //               </CardHeader>
// //               <CardContent className="w-full overflow-x-auto">
// //                 <div className="min-h-[250px] sm:min-h-[300px] md:min-h-[350px] w-full">
// //                   <ResponsiveContainer width="100%" height={typeof window !== 'undefined' ? (window.innerWidth < 640 ? 250 : window.innerWidth < 768 ? 300 : 350) : 350}>
// //                     <BarChart data={prepareComparisonData(data)} margin={{ top: 20, right: 20, left: 0, bottom: typeof window !== 'undefined' && window.innerWidth < 640 ? 80 : 60 }}>
// //                       <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
// //                       <XAxis
// //                         dataKey="name"
// //                         angle={-45}
// //                         textAnchor="end"
// //                         height={typeof window !== 'undefined' && window.innerWidth < 640 ? 100 : 100}
// //                         tick={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 12 }}
// //                       />
// //                       <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 12 }} />
// //                       <Tooltip
// //                         contentStyle={{
// //                           backgroundColor: "hsl(var(--card))",
// //                           border: "1px solid hsl(var(--border))",
// //                           borderRadius: "8px",
// //                           fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 12,
// //                         }}
// //                         cursor={{ fill: "hsl(var(--primary))", opacity: 0.1 }}
// //                       />
// //                       <Legend wrapperStyle={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 12 }} />
// //                       <Bar dataKey="current" fill="hsl(var(--primary))" name={t("current")} radius={[8, 8, 0, 0]} />
// //                       <Bar dataKey="optimal" fill="hsl(var(--success))" name={t("optimal")} radius={[8, 8, 0, 0]} />
// //                     </BarChart>
// //                   </ResponsiveContainer>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Health Score Gauge-like Display */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle className="text-base sm:text-lg">{t("soilHealthStatus")}</CardTitle>
// //                 <CardDescription className="text-xs sm:text-sm">{t("detailedHealthAssessment")}</CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
// //                   {/* Score Display — percentage rendered inside the circle */}
// //                   <div className="flex flex-col items-center justify-center py-4 sm:py-0">
// //                     <svg
// //                       width={typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 140}
// //                       height={typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 140}
// //                       viewBox="0 0 120 120"
// //                     >
// //                       {/* Track circle */}
// //                       <circle
// //                         cx="60"
// //                         cy="60"
// //                         r="50"
// //                         fill="none"
// //                         stroke="hsl(var(--muted))"
// //                         strokeWidth="8"
// //                       />
// //                       {/* Progress arc — rotated so start is at top */}
// //                       <circle
// //                         cx="60"
// //                         cy="60"
// //                         r="50"
// //                         fill="none"
// //                         stroke={
// //                           healthScore >= 80
// //                             ? "hsl(var(--success))"
// //                             : healthScore >= 60
// //                               ? "hsl(var(--warning))"
// //                               : "hsl(var(--destructive))"
// //                         }
// //                         strokeWidth="8"
// //                         strokeDasharray={`${(healthScore / 100) * 314.16} 314.16`}
// //                         strokeLinecap="round"
// //                         transform="rotate(-90 60 60)"
// //                       />
// //                       {/* Score text — centered inside circle */}
// //                       <text
// //                         x="60"
// //                         y="56"
// //                         textAnchor="middle"
// //                         dominantBaseline="middle"
// //                         style={{
// //                           fontSize: '22px',
// //                           fontWeight: 700,
// //                           fill: 'hsl(var(--primary))',
// //                           fontFamily: 'inherit',
// //                         }}
// //                       >
// //                         {healthScore}%
// //                       </text>
// //                       <text
// //                         x="60"
// //                         y="76"
// //                         textAnchor="middle"
// //                         dominantBaseline="middle"
// //                         style={{
// //                           fontSize: '10px',
// //                           fill: 'hsl(var(--muted-foreground))',
// //                           fontFamily: 'inherit',
// //                         }}
// //                       >
// //                         {t("healthScoreLabel")}
// //                       </text>
// //                     </svg>
// //                   </div>

// //                   {/* Status Cards */}
// //                   <div className="space-y-2 sm:space-y-3">
// //                     <div className="p-2 sm:p-3 rounded-lg bg-primary/5 border border-primary/20">
// //                       <div className="text-xs text-muted-foreground mb-1">{t("nutrients")}</div>
// //                       <div className="text-sm sm:text-base font-semibold">
// //                         {getStatus("nitrogen", data.nitrogen) === "optimal"
// //                           ? t("optimal")
// //                           : t(getStatus("nitrogen", data.nitrogen))}
// //                       </div>
// //                     </div>
// //                     <div className="p-2 sm:p-3 rounded-lg bg-warning/5 border border-warning/20">
// //                       <div className="text-xs text-muted-foreground mb-1">{t("ph")}</div>
// //                       <div className="text-sm sm:text-base font-semibold">
// //                         {getStatus("ph", data.ph) === "optimal" ? t("ideal") : t(getStatus("ph", data.ph))}
// //                       </div>
// //                     </div>
// //                     <div className="p-2 sm:p-3 rounded-lg bg-info/5 border border-info/20">
// //                       <div className="text-xs text-muted-foreground mb-1">{t("moisture")}</div>
// //                       <div className="text-sm sm:text-base font-semibold">
// //                         {getStatus("humidity", data.humidity) === "good" ? t("good") : t(getStatus("humidity", data.humidity))}
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {/* Metrics Summary */}
// //                   <div className="space-y-2 text-xs sm:text-sm">
// //                     <div className="flex justify-between items-center p-2 rounded bg-muted/30">
// //                       <span className="text-muted-foreground">{t("nitrogen")}</span>
// //                       <span className="font-semibold truncate">{data.nitrogen} {t("mgPerKg")}</span>
// //                     </div>
// //                     <div className="flex justify-between items-center p-2 rounded bg-muted/30">
// //                       <span className="text-muted-foreground">{t("phosphorus")}</span>
// //                       <span className="font-semibold truncate">{data.phosphorus} {t("mgPerKg")}</span>
// //                     </div>
// //                     <div className="flex justify-between items-center p-2 rounded bg-muted/30">
// //                       <span className="text-muted-foreground">{t("potassium")}</span>
// //                       <span className="font-semibold truncate">{data.potassium} {t("mgPerKg")}</span>
// //                     </div>
// //                     <div className="flex justify-between items-center p-2 rounded bg-muted/30">
// //                       <span className="text-muted-foreground">{t("temperature")}</span>
// //                       <span className="font-semibold truncate">{data.soilTemp}{t("celsius")}</span>
// //                     </div>
// //                     <div className="flex justify-between items-center p-2 rounded bg-muted/30">
// //                       <span className="text-muted-foreground">{t("humidity")}</span>
// //                       <span className="font-semibold truncate">{data.humidity}{t("percent")}</span>
// //                     </div>
// //                     <div className="flex justify-between items-center p-2 rounded bg-muted/30">
// //                       <span className="text-muted-foreground">{t("ph")}</span>
// //                       <span className="font-semibold truncate">{data.ph}</span>
// //                     </div>
// //                     <div className="flex justify-between items-center p-2 rounded bg-muted/30">
// //                       <span className="text-muted-foreground">{t("ec")}</span>
// //                       <span className="font-semibold truncate text-xs">{data.ec} {t("msPerCm")}</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </motion.div>
// //         </>
// //       )}
// //     </div>
// //   );
// // }









































// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { Droplets, Thermometer, Wind, Zap, FlaskConical, Gauge, Sprout, AlertCircle, Loader2, TrendingUp, Mic, Leaf } from "lucide-react";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { MetricCard } from "@/components/MetricCard";
// import { sensorService, type SensorReading } from "@/services/sensorService";
// import { chatService, type CropRecommendationItem } from "@/services/chatService";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   RadarChart,
//   Radar,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";

// const URDU_TRANSLATIONS: Record<string, string> = {
//   // Phrases
//   "within optimal range": "بہترین حد میں ہیں",
//   "slightly outside ideal range": "مثالی حد سے تھوڑا باہر ہیں",
//   "Conditions are broadly suitable.": "حالات مناسب ہیں۔",
//   // Crops
//   "Rice": "چاول",
//   "Cotton": "کپاس",
//   "Maize": "مکئی",
//   "Sugarcane": "گنا",
//   "Sorghum (Jowar)": "جوار",
//   "Millet (Bajra)": "باجرہ",
//   "Sesame (Til)": "تل",
//   "Mung Bean (Moong)": "مونگ",
//   "Moth Bean (Mash)": "ماش",
//   "Wheat": "گندم",
//   "Mustard (Sarson)": "سرسوں",
//   "Chickpea (Chanay)": "چنے",
//   "Lentil (Masoor)": "مسور",
//   "Barley (Jau)": "جو",
//   "Potato": "آلو",
//   "Tomato": "ٹماٹر",
//   "Onion (Pyaaz)": "پیاز",
//   "Chilli": "مرچ",
//   "Garlic (Lehsan)": "لہسن",
//   "Spinach (Palak)": "پالک",
//   "Sunflower": "سورج مکھی",
//   "Canola (Toria)": "کینولا",
//   "Groundnut (Mungphali)": "مونگ پھلی",
//   // Parameters
//   "pH": "پی ایچ",
//   "Nitrogen": "نائٹروجن",
//   "Phosphorus": "فاسفورس",
//   "Potassium": "پوٹاشیم",
//   "Humidity": "نمی",
//   "Temperature": "درجہ حرارت",
//   "EC": "ای سی",
// };

// const translateDynamicText = (text: string, lang: string) => {
//   if (lang !== "ur" || !text) return text;
//   let translated = text;
//   Object.entries(URDU_TRANSLATIONS).forEach(([eng, ur]) => {
//     const regex = new RegExp(eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
//     translated = translated.replace(regex, ur);
//   });
//   return translated;
// };

// interface DisplayedSensorData {
//   nitrogen: number;
//   phosphorus: number;
//   potassium: number;
//   ph: number;
//   soilTemp: number;
//   humidity: number;
//   ec: number;
// }

// const transformSensorData = (reading: SensorReading): DisplayedSensorData => ({
//   nitrogen: reading.nitrogen,
//   phosphorus: reading.phosphorus,
//   potassium: reading.potassium,
//   ph: reading.ph,
//   soilTemp: reading.temperature,
//   humidity: reading.humidity,
//   ec: reading.ec,
// });

// const getStatus = (key: string, val: number): "good" | "optimal" | "high" | "low" | "moderate" => {
//   if (key === "nitrogen") return val >= 200 && val <= 250 ? "optimal" : val < 200 ? "low" : "high";
//   if (key === "phosphorus") return val >= 20 && val <= 30 ? "optimal" : val < 20 ? "low" : "high";
//   if (key === "potassium") return val >= 150 && val <= 200 ? "optimal" : val < 150 ? "low" : "high";
//   if (key === "ph") return val >= 6.0 && val <= 7.0 ? "optimal" : val < 6 ? "low" : "high";
//   if (key === "soilTemp") return val >= 20 && val <= 30 ? "optimal" : val < 20 ? "low" : "high";
//   if (key === "humidity") return val >= 40 && val <= 70 ? "good" : val < 40 ? "low" : "high";
//   if (key === "ec") return val >= 800 && val <= 1500 ? "optimal" : val < 800 ? "low" : "high";
//   return "good";
// };

// const calculateHealthScore = (data: DisplayedSensorData): number => {
//   let score = 0;

//   if (data.nitrogen >= 200 && data.nitrogen <= 250) score += 15;
//   else if (data.nitrogen >= 150 && data.nitrogen <= 300) score += 10;
//   else if (data.nitrogen > 0) score += 5;

//   if (data.phosphorus >= 20 && data.phosphorus <= 30) score += 15;
//   else if (data.phosphorus >= 15 && data.phosphorus <= 40) score += 10;
//   else if (data.phosphorus > 0) score += 5;

//   if (data.potassium >= 150 && data.potassium <= 200) score += 15;
//   else if (data.potassium >= 100 && data.potassium <= 250) score += 10;
//   else if (data.potassium > 0) score += 5;

//   if (data.ph >= 6.0 && data.ph <= 7.0) score += 15;
//   else if (data.ph >= 5.5 && data.ph <= 7.5) score += 10;
//   else if (data.ph > 0) score += 5;

//   if (data.soilTemp >= 20 && data.soilTemp <= 30) score += 10;
//   else if (data.soilTemp >= 15 && data.soilTemp <= 35) score += 7;
//   else if (data.soilTemp > 0) score += 3;

//   if (data.humidity >= 40 && data.humidity <= 70) score += 15;
//   else if (data.humidity >= 30 && data.humidity <= 80) score += 10;
//   else if (data.humidity > 0) score += 5;

//   if (data.ec >= 800 && data.ec <= 1500) score += 15;
//   else if (data.ec >= 600 && data.ec <= 2000) score += 10;
//   else if (data.ec > 0) score += 5;

//   return Math.min(100, score);
// };

// const prepareRadarData = (data: DisplayedSensorData) => {
//   return [
//     { name: "N",        value: Math.min(100, (data.nitrogen / 300) * 100),    fullMark: 100 },
//     { name: "P",        value: Math.min(100, (data.phosphorus / 40) * 100),   fullMark: 100 },
//     { name: "K",        value: Math.min(100, (data.potassium / 250) * 100),   fullMark: 100 },
//     { name: "pH",       value: Math.min(100, ((data.ph / 8) * 100)),          fullMark: 100 },
//     { name: "Temp",     value: Math.min(100, ((data.soilTemp / 40) * 100)),   fullMark: 100 },
//     { name: "Humidity", value: data.humidity,                                  fullMark: 100 },
//     { name: "EC",       value: Math.min(100, ((data.ec / 2000) * 100)),       fullMark: 100 },
//   ];
// };

// const prepareComparisonData = (data: DisplayedSensorData) => {
//   return [
//     { name: "Nitrogen",    current: data.nitrogen,     optimal: 225, max: 300 },
//     { name: "Phosphorus",  current: data.phosphorus,   optimal: 25,  max: 40  },
//     { name: "Potassium",   current: data.potassium,    optimal: 175, max: 250 },
//     { name: "pH",          current: data.ph * 10,      optimal: 65,  max: 80  },
//     { name: "Temperature", current: data.soilTemp,     optimal: 25,  max: 40  },
//     { name: "Humidity",    current: data.humidity,     optimal: 55,  max: 100 },
//     { name: "EC",          current: data.ec / 10,      optimal: 115, max: 200 },
//   ];
// };

// export default function Dashboard() {
//   const { t, language } = useLanguage();
//   const navigate = useNavigate();
//   const [data, setData] = useState<DisplayedSensorData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [cropRecs, setCropRecs] = useState<CropRecommendationItem[]>([]);
//   const [cropSummary, setCropSummary] = useState<string>("");
//   const [cropLoading, setCropLoading] = useState(true);
//   const [cropError, setCropError] = useState<string | null>(null);

//   const fetchSensorData = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const reading = await sensorService.getLatest();
//       setData(transformSensorData(reading));
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : t("failedToFetchData")
//       );
//       console.error("Failed to fetch sensor data:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchCropRecommendations = async () => {
//     try {
//       setCropLoading(true);
//       setCropError(null);
//       const res = await chatService.getCropRecommendations();
//       setCropRecs(res.recommendations ?? []);
//       setCropSummary(res.summary ?? "");
//     } catch (err) {
//       setCropError(err instanceof Error ? err.message : "Failed to load crop recommendations");
//     } finally {
//       setCropLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSensorData();
//     fetchCropRecommendations();
//     const interval = setInterval(fetchSensorData, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   // ── 1. metrics array with idealRange ──────────────────────────────────────
//   const metrics = [
//     { key: "nitrogen",   icon: Sprout,       label: t("nitrogen"),   value: data?.nitrogen   || 0, unit: t("mgPerKg"), color: "bg-primary/10 text-primary",         idealRange: "50-150"  },
//     { key: "phosphorus", icon: FlaskConical,  label: t("phosphorus"), value: data?.phosphorus || 0, unit: t("mgPerKg"), color: "bg-info/10 text-info",               idealRange: "36-50"   },
//     { key: "potassium",  icon: Zap,           label: t("potassium"),  value: data?.potassium  || 0, unit: t("mgPerKg"), color: "bg-warning/10 text-warning",         idealRange: "131-175" },
//     { key: "ph",         icon: Gauge,         label: t("ph"),         value: data?.ph         || 0, unit: "",           color: "bg-accent text-accent-foreground",   idealRange: "5.8-6.5" },
//     { key: "soilTemp",   icon: Thermometer,   label: t("soilTemp"),   value: data?.soilTemp   || 0, unit: t("celsius"), color: "bg-destructive/10 text-destructive", idealRange: "20-30"   },
//     { key: "humidity",   icon: Droplets,      label: t("humidity"),   value: data?.humidity   || 0, unit: t("percent"), color: "bg-info/10 text-info",               idealRange: "40-70"   },
//     { key: "ec",         icon: Wind,          label: t("ec"),         value: data?.ec         || 0, unit: t("msPerCm"), color: "bg-success/10 text-success",         idealRange: "0.2-1.2" },
//   ];

//   const healthScore = data ? Math.round(calculateHealthScore(data)) : 0;

//   return (
//     <div className="max-w-7xl mx-auto relative z-10">

//       {/* Loading State */}
//       {isLoading && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="flex items-center justify-center py-12"
//         >
//           <Loader2 className="w-8 h-8 animate-spin text-primary" />
//           <span className="ml-2 text-muted-foreground">{t("loadingSensorData")}</span>
//         </motion.div>
//       )}

//       {/* Error State */}
//       {error && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-6"
//         >
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         </motion.div>
//       )}

//       {/* Main Content */}
//       {!isLoading && data && (
//         <>
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-4 sm:mb-6 lg:mb-8 px-0.5"
//           >
//             <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{t("sensorOverview")}</h1>
//             <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{t("realTimeMonitoring")}</p>
//           </motion.div>

//           {/* Soil Health Score */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="metric-card mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-card/90 backdrop-blur-md p-4 sm:p-6 rounded-lg"
//           >
//             <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
//               <span className="text-2xl sm:text-3xl font-bold text-primary">{healthScore}</span>
//             </div>
//             <div className="flex-1">
//               <h3 className="text-base sm:text-lg font-semibold text-foreground">{t("soilHealthScore")}</h3>
//               <p className="text-xs sm:text-sm text-muted-foreground">
//                 {healthScore >= 80 ? t("excellent") : healthScore >= 60 ? t("good") : t("needsImprovement")} - {t("realTimeMonitoring")}
//               </p>
//             </div>
//             <div className="flex items-center gap-2 ml-auto sm:ml-0">
//               <span className="live-dot" />
//               <span className="text-xs font-semibold text-success uppercase tracking-wider">{t("live")}</span>
//             </div>
//           </motion.div>

//           {/* AI Advisor CTA */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="mb-8"
//           >
//             <Card
//               className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 cursor-pointer hover:shadow-lg transition-shadow"
//               onClick={() => navigate("/ai-advisor")}
//             >
//               <CardContent className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-4">
//                 <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
//                   <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-1 sm:mt-0">
//                     <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-sm sm:text-base font-semibold text-foreground">{t("getAiRecommendationTitle")}</h3>
//                     <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{t("getAiRecommendationDescription")}</p>
//                   </div>
//                 </div>
//                 <div className="w-full sm:w-auto mt-2 sm:mt-0">
//                   <Button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       navigate("/ai-advisor");
//                     }}
//                     className="w-full sm:w-auto whitespace-nowrap text-xs sm:text-sm"
//                   >
//                     {t("openAiAdvisor")}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* ── 2. Metric Cards Grid with idealRange prop ── */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//             {metrics.map((m, i) => (
//               <MetricCard
//                 key={m.key}
//                 icon={m.icon}
//                 label={m.label}
//                 value={m.value}
//                 unit={m.unit}
//                 status={getStatus(m.key, m.value)}
//                 color={m.color}
//                 index={i}
//                 idealRange={m.idealRange}
//               />
//             ))}

//             {/* 8th Card: Top 3 Recommended Crops */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: metrics.length * 0.08 }}
//               className="relative overflow-hidden rounded-xl border border-emerald-200 dark:border-emerald-900 shadow-md flex flex-col"
//               style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)" }}
//             >
//               <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
//               <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-teal-400/20 blur-xl pointer-events-none" />

//               <div className="relative flex items-center gap-2 px-4 pt-4 pb-2">
//                 <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm shrink-0">
//                   <Leaf className="w-4 h-4 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-[11px] font-bold text-emerald-900 leading-tight">{t("topRecommendedCrops")}</p>
//                   <p className="text-[9px] text-emerald-700 font-medium">{t("basedOnLiveSensorData")}</p>
//                 </div>
//               </div>

//               <div className="mx-4 h-px bg-emerald-200/70" />

//               <div className="relative flex-1 px-4 py-3 space-y-2">
//                 {cropLoading ? (
//                   <div className="flex items-center gap-2 text-emerald-700 text-xs py-1">
//                     <Loader2 className="w-3 h-3 animate-spin" />
//                     <span className="font-medium">{t("analyzingSoilData")}</span>
//                   </div>
//                 ) : cropError ? (
//                   <div className="flex items-start gap-1.5">
//                     <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
//                     <p className="text-[10px] text-red-600 leading-tight">{cropError}</p>
//                   </div>
//                 ) : (
//                   <>
//                     {cropRecs.slice(0, 3).map((crop, idx) => {
//                       const translatedName = translateDynamicText(crop.name, language);
//                       const translatedReason = crop.reason ? translateDynamicText(crop.reason, language) : "";
//                       const medals = ["🥇", "🥈", "🥉"];
//                       const bgColors = [
//                         "bg-yellow-100/80 border-yellow-300",
//                         "bg-gray-100/80 border-gray-300",
//                         "bg-orange-100/80 border-orange-300",
//                       ];
//                       return (
//                         <div
//                           key={crop.rank}
//                           className={`flex items-start gap-2 rounded-lg border px-2.5 py-1.5 backdrop-blur-sm ${bgColors[idx]}`}
//                         >
//                           <span className="text-base leading-none mt-0.5">{medals[idx]}</span>
//                           <div className="min-w-0">
//                             <p className="text-[11px] font-bold text-gray-900 truncate">{translatedName}</p>
//                             {translatedReason && (
//                               <p className="text-[9px] text-gray-600 leading-tight line-clamp-1 mt-0.5">{translatedReason}</p>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                     {cropSummary && (
//                       <p className="text-[9px] text-emerald-800 pt-1 leading-snug line-clamp-2 italic">
//                         {translateDynamicText(cropSummary, language)}
//                       </p>
//                     )}
//                   </>
//                 )}
//               </div>

//               <div className="relative px-4 pb-4">
//                 <button
//                   onClick={() => navigate("/ai-advisor")}
//                   className="w-full py-2 rounded-lg text-xs font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
//                   style={{ background: "linear-gradient(90deg, #059669, #10b981)" }}
//                 >
//                   {t("getMoreInfo")}
//                 </button>
//               </div>
//             </motion.div>
//           </div>

//           {/* Charts Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6 }}
//             className="mt-8 sm:mt-12 space-y-4 sm:space-y-6"
//           >
//             <div className="flex items-center gap-2 mb-4 sm:mb-6">
//               <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
//               <h2 className="text-lg sm:text-xl font-bold text-foreground">{t("analytics")}</h2>
//             </div>

//             {/* Radar Chart */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base sm:text-lg">{t("sensorMetricsOverview")}</CardTitle>
//                 <CardDescription className="text-xs sm:text-sm">{t("normalizedReadings")}</CardDescription>
//               </CardHeader>
//               <CardContent className="w-full overflow-x-auto">
//                 <div className="min-h-[250px] sm:min-h-[320px] md:min-h-[400px] w-full">
//                   <ResponsiveContainer width="100%" height={typeof window !== 'undefined' ? (window.innerWidth < 640 ? 250 : window.innerWidth < 768 ? 320 : 400) : 400}>
//                     <RadarChart data={prepareRadarData(data)}>
//                       <PolarGrid stroke="hsl(var(--muted-foreground))" opacity={0.2} />
//                       <PolarAngleAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 12 }} />
//                       <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
//                       <Radar
//                         name={t("current")}
//                         dataKey="value"
//                         stroke="hsl(var(--primary))"
//                         fill="hsl(var(--primary))"
//                         fillOpacity={0.6}
//                       />
//                     </RadarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Bar Chart */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base sm:text-lg">{t("currentVsOptimalLevels")}</CardTitle>
//                 <CardDescription className="text-xs sm:text-sm">{t("comparisonValues")}</CardDescription>
//               </CardHeader>
//               <CardContent className="w-full overflow-x-auto">
//                 <div className="min-h-[250px] sm:min-h-[300px] md:min-h-[350px] w-full">
//                   <ResponsiveContainer width="100%" height={typeof window !== 'undefined' ? (window.innerWidth < 640 ? 250 : window.innerWidth < 768 ? 300 : 350) : 350}>
//                     <BarChart data={prepareComparisonData(data)} margin={{ top: 20, right: 20, left: 0, bottom: typeof window !== 'undefined' && window.innerWidth < 640 ? 80 : 60 }}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
//                       <XAxis
//                         dataKey="name"
//                         angle={-45}
//                         textAnchor="end"
//                         height={typeof window !== 'undefined' && window.innerWidth < 640 ? 100 : 100}
//                         tick={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 12 }}
//                       />
//                       <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 12 }} />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "hsl(var(--card))",
//                           border: "1px solid hsl(var(--border))",
//                           borderRadius: "8px",
//                           fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 12,
//                         }}
//                         cursor={{ fill: "hsl(var(--primary))", opacity: 0.1 }}
//                       />
//                       <Legend wrapperStyle={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 12 }} />
//                       <Bar dataKey="current" fill="hsl(var(--primary))" name={t("current")} radius={[8, 8, 0, 0]} />
//                       <Bar dataKey="optimal" fill="hsl(var(--success))" name={t("optimal")} radius={[8, 8, 0, 0]} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Health Score */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base sm:text-lg">{t("soilHealthStatus")}</CardTitle>
//                 <CardDescription className="text-xs sm:text-sm">{t("detailedHealthAssessment")}</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//                   {/* Score Circle */}
//                   <div className="flex flex-col items-center justify-center py-4 sm:py-0">
//                     <svg
//                       width={typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 140}
//                       height={typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 140}
//                       viewBox="0 0 120 120"
//                     >
//                       <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
//                       <circle
//                         cx="60" cy="60" r="50" fill="none"
//                         stroke={healthScore >= 80 ? "hsl(var(--success))" : healthScore >= 60 ? "hsl(var(--warning))" : "hsl(var(--destructive))"}
//                         strokeWidth="8"
//                         strokeDasharray={`${(healthScore / 100) * 314.16} 314.16`}
//                         strokeLinecap="round"
//                         transform="rotate(-90 60 60)"
//                       />
//                       <text x="60" y="56" textAnchor="middle" dominantBaseline="middle"
//                         style={{ fontSize: '22px', fontWeight: 700, fill: 'hsl(var(--primary))', fontFamily: 'inherit' }}
//                       >
//                         {healthScore}%
//                       </text>
//                       <text x="60" y="76" textAnchor="middle" dominantBaseline="middle"
//                         style={{ fontSize: '10px', fill: 'hsl(var(--muted-foreground))', fontFamily: 'inherit' }}
//                       >
//                         {t("healthScoreLabel")}
//                       </text>
//                     </svg>
//                   </div>

//                   {/* Status Cards */}
//                   <div className="space-y-2 sm:space-y-3">
//                     <div className="p-2 sm:p-3 rounded-lg bg-primary/5 border border-primary/20">
//                       <div className="text-xs text-muted-foreground mb-1">{t("nutrients")}</div>
//                       <div className="text-sm sm:text-base font-semibold">
//                         {getStatus("nitrogen", data.nitrogen) === "optimal" ? t("optimal") : t(getStatus("nitrogen", data.nitrogen))}
//                       </div>
//                     </div>
//                     <div className="p-2 sm:p-3 rounded-lg bg-warning/5 border border-warning/20">
//                       <div className="text-xs text-muted-foreground mb-1">{t("ph")}</div>
//                       <div className="text-sm sm:text-base font-semibold">
//                         {getStatus("ph", data.ph) === "optimal" ? t("ideal") : t(getStatus("ph", data.ph))}
//                       </div>
//                     </div>
//                     <div className="p-2 sm:p-3 rounded-lg bg-info/5 border border-info/20">
//                       <div className="text-xs text-muted-foreground mb-1">{t("moisture")}</div>
//                       <div className="text-sm sm:text-base font-semibold">
//                         {getStatus("humidity", data.humidity) === "good" ? t("good") : t(getStatus("humidity", data.humidity))}
//                       </div>
//                     </div>
//                   </div>

//                   {/* ── 3. Metrics Summary with fixed EC display ── */}
//                   <div className="space-y-2 text-xs sm:text-sm">
//                     <div className="flex justify-between items-center p-2 rounded bg-muted/30">
//                       <span className="text-muted-foreground">{t("nitrogen")}</span>
//                       <span className="font-semibold truncate">{data.nitrogen} {t("mgPerKg")}</span>
//                     </div>
//                     <div className="flex justify-between items-center p-2 rounded bg-muted/30">
//                       <span className="text-muted-foreground">{t("phosphorus")}</span>
//                       <span className="font-semibold truncate">{data.phosphorus} {t("mgPerKg")}</span>
//                     </div>
//                     <div className="flex justify-between items-center p-2 rounded bg-muted/30">
//                       <span className="text-muted-foreground">{t("potassium")}</span>
//                       <span className="font-semibold truncate">{data.potassium} {t("mgPerKg")}</span>
//                     </div>
//                     <div className="flex justify-between items-center p-2 rounded bg-muted/30">
//                       <span className="text-muted-foreground">{t("temperature")}</span>
//                       <span className="font-semibold truncate">{data.soilTemp}{t("celsius")}</span>
//                     </div>
//                     <div className="flex justify-between items-center p-2 rounded bg-muted/30">
//                       <span className="text-muted-foreground">{t("humidity")}</span>
//                       <span className="font-semibold truncate">{data.humidity}{t("percent")}</span>
//                     </div>
//                     <div className="flex justify-between items-center p-2 rounded bg-muted/30">
//                       <span className="text-muted-foreground">{t("ph")}</span>
//                       <span className="font-semibold truncate">{data.ph}</span>
//                     </div>
//                     <div className="flex justify-between items-center p-2 rounded bg-muted/30">
//                       <span className="text-muted-foreground">{t("ec")}</span>
//                       <span className="font-semibold truncate text-xs">
//                         {(data.ec / 1000).toFixed(2)} mS/cm
//                       </span>
//                     </div>
//                   </div>

//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </>
//       )}
//     </div>
//   );
// }





















import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Droplets, Thermometer, Wind, Zap, FlaskConical, Gauge, Sprout, AlertCircle, Loader2, TrendingUp, Mic, Leaf } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MetricCard } from "@/components/MetricCard";
import { sensorService, type SensorReading } from "@/services/sensorService";
import { chatService, type CropRecommendationItem } from "@/services/chatService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// ─── Source of truth for all soil thresholds ──────────────────────────────
const SOIL_THRESHOLDS = {
  N:   { min: 50,  max: 150  },   // mg/kg
  P:   { min: 36,  max: 50   },   // mg/kg
  K:   { min: 131, max: 175  },   // mg/kg
  pH:  { min: 5.8, max: 6.5  },
  EC:  { min: 0.2, max: 1.2  },   // mS/cm  (sensor sends µS/cm → divide by 1000)
  T:   { min: 20,  max: 30   },   // °C
  H:   { min: 40,  max: 70   },   // %
} as const;

type ThresholdKey = keyof typeof SOIL_THRESHOLDS;

const URDU_TRANSLATIONS: Record<string, string> = {
  // Phrases
  "within optimal range": "بہترین حد میں ہیں",
  "slightly outside ideal range": "مثالی حد سے تھوڑا باہر ہیں",
  "Conditions are broadly suitable.": "حالات مناسب ہیں۔",
  // Crops
  "Rice": "چاول",
  "Cotton": "کپاس",
  "Maize": "مکئی",
  "Sugarcane": "گنا",
  "Sorghum (Jowar)": "جوار",
  "Millet (Bajra)": "باجرہ",
  "Sesame (Til)": "تل",
  "Mung Bean (Moong)": "مونگ",
  "Moth Bean (Mash)": "ماش",
  "Wheat": "گندم",
  "Mustard (Sarson)": "سرسوں",
  "Chickpea (Chanay)": "چنے",
  "Lentil (Masoor)": "مسور",
  "Barley (Jau)": "جو",
  "Potato": "آلو",
  "Tomato": "ٹماٹر",
  "Onion (Pyaaz)": "پیاز",
  "Chilli": "مرچ",
  "Garlic (Lehsan)": "لہسن",
  "Spinach (Palak)": "پالک",
  "Sunflower": "سورج مکھی",
  "Canola (Toria)": "کینولا",
  "Groundnut (Mungphali)": "مونگ پھلی",
  // Parameters
  "pH": "پی ایچ",
  "Nitrogen": "نائٹروجن",
  "Phosphorus": "فاسفورس",
  "Potassium": "پوٹاشیم",
  "Humidity": "نمی",
  "Temperature": "درجہ حرارت",
  "EC": "ای سی",
};

const translateDynamicText = (text: string, lang: string) => {
  if (lang !== "ur" || !text) return text;
  let translated = text;
  Object.entries(URDU_TRANSLATIONS).forEach(([eng, ur]) => {
    const regex = new RegExp(eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    translated = translated.replace(regex, ur);
  });
  return translated;
};

interface DisplayedSensorData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  soilTemp: number;
  humidity: number;
  ec: number;
}

const transformSensorData = (reading: SensorReading): DisplayedSensorData => ({
  nitrogen: reading.nitrogen,
  phosphorus: reading.phosphorus,
  potassium: reading.potassium,
  ph: reading.ph,
  soilTemp: reading.temperature,
  humidity: reading.humidity,
  ec: reading.ec,
});

// // ─── Score a single metric against its threshold band ─────────────────────
// //
// // Points awarded (out of `maxPoints`):
// //   Within [min, max]               → 100 %  (full)
// //   Within 20 % outside the band    →  60 %  (partial)
// //   More than 20 % outside the band →  20 %  (minimal)
// //
// const scoreMetric = (
//   value: number,
//   key: ThresholdKey,
//   maxPoints: number
// ): number => {
//   const { min, max } = SOIL_THRESHOLDS[key];
//   const range = max - min;

//   // Value is within the optimal band
//   if (value >= min && value <= max) {
//     return maxPoints;
//   }

//   // How far outside the band is the value, expressed as a fraction of the range?
//   const deviation = value < min ? (min - value) / range : (value - max) / range;

//   // Slightly outside → ≤ 20 % of the range beyond the boundary
//   if (deviation <= 0.2) {
//     return Math.round(maxPoints * 0.6);
//   }

//   // Severely outside
//   return Math.round(maxPoints * 0.2);
// };

// // // ─── Soil health score (0–100) ────────────────────────────────────────────
// // //
// // // Each of the 7 metrics contributes an equal share of the total (100 / 7 ≈ 14.3 pts).
// // // EC is converted from µS/cm (sensor) to mS/cm (threshold) before scoring.
// // //
// // const calculateHealthScore = (data: DisplayedSensorData): number => {
// //   const METRIC_COUNT = 7;
// //   const pointsEach = 100 / METRIC_COUNT; // ≈ 14.286 per metric

// //   const ecInMsCm = data.ec / 1000; // µS/cm → mS/cm

// //   const total =
// //     scoreMetric(data.nitrogen,   "N",  pointsEach) +
// //     scoreMetric(data.phosphorus, "P",  pointsEach) +
// //     scoreMetric(data.potassium,  "K",  pointsEach) +
// //     scoreMetric(data.ph,         "pH", pointsEach) +
// //     scoreMetric(ecInMsCm,        "EC", pointsEach) +
// //     scoreMetric(data.soilTemp,   "T",  pointsEach) +
// //     scoreMetric(data.humidity,   "H",  pointsEach);

// //   return Math.min(100, Math.round(total));
// // };

// // ─── Soil health score (0–100) ────────────────────────────────────────────
// //
// // Scoring per metric (weight × earned multiplier):
// //   Within [min, max]                      → 1.0  (full points)
// //   Within ±20 % of the boundary           → 0.5  (partial points)
// //   Completely out of range                → 0.0  (no points)
// //
// // Special hard-zero rules:
// //   pH  < 4.0 or > 8.0                    → 0.0  (physiologically dead zone)
// //   EC  = 0 (sensor offline / dry soil)   → 0.0
// //
// // Weights reflect agronomic importance:
// //   pH (25) > N (20) > P (15) > K (15) > EC (10) > T (10) > H (5)  = 100 total
// //
// const calculateHealthScore = (data: DisplayedSensorData): number => {

//   // ── Zero-state / sensor-offline guard ──────────────────────────────────
//   const isSensorOffline =
//     data.nitrogen   === 0 &&
//     data.phosphorus === 0 &&
//     data.potassium  === 0 &&
//     data.ph         === 0 &&
//     data.ec         === 0;

//   if (isSensorOffline) return 0;

//   // ── Scorer ─────────────────────────────────────────────────────────────
//   //
//   // Returns a multiplier: 1.0 | 0.5 | 0.0
//   // `hardZeroFn` is an optional extra condition that overrides everything
//   // and forces 0 points regardless of proximity to the threshold band.
//   //
//   const score = (
//     value:       number,
//     min:         number,
//     max:         number,
//     hardZeroFn?: (v: number) => boolean,
//   ): number => {
//     if (hardZeroFn?.(value)) return 0;

//     if (value >= min && value <= max) return 1.0;   // inside ideal band

//     const band  = max - min;
//     const slack = band * 0.20;                       // ±20 % of band width

//     const nearLow  = value >= min - slack && value < min;
//     const nearHigh = value >  max         && value <= max + slack;

//     if (nearLow || nearHigh) return 0.5;             // slightly outside

//     return 0;                                        // completely out of range
//   };

//   // ── EC: sensor sends µS/cm → convert to mS/cm before scoring ──────────
//   const ecMsCm = data.ec / 1000;

//   // ── Weighted metrics table ─────────────────────────────────────────────
//   const metrics: Array<{ earned: number; weight: number }> = [
//     {
//       weight: 25,
//       earned: score(data.ph, 5.8, 6.5, (v) => v < 4.0 || v > 8.0),
//     },
//     {
//       weight: 20,
//       earned: score(data.nitrogen, 50, 150),
//     },
//     {
//       weight: 15,
//       earned: score(data.phosphorus, 36, 50),
//     },
//     {
//       weight: 15,
//       earned: score(data.potassium, 131, 175),
//     },
//     {
//       weight: 10,
//       earned: score(ecMsCm, 0.2, 1.2, (v) => v === 0),
//     },
//     {
//       weight: 10,
//       earned: score(data.soilTemp, 20, 30),
//     },
//     {
//       weight: 5,
//       earned: score(data.humidity, 40, 70),
//     },
//   ];

//   // ── Final score ────────────────────────────────────────────────────────
//   const totalWeight  = metrics.reduce((sum, m) => sum + m.weight,          0); // 100
//   const earnedPoints = metrics.reduce((sum, m) => sum + m.weight * m.earned, 0);

//   return Math.round((earnedPoints / totalWeight) * 100);
// };

// ─── Continuous Gaussian scorer ───────────────────────────────────────────
//
// Maps any real-valued sensor reading to [0, 100] using a bell-curve centred
// on the midpoint of the optimal range.
//
// Shape of the curve:
//   • Peaks at exactly 100 when value == mid
//   • Passes through ~60 at the band edges (min / max)
//   • Decays smoothly to 0 as the value moves far outside the band
//
// σ (sigma) is derived so that the score at the band edge equals the chosen
// `edgeScore` (default 0.60 → 60 %).  Solving the Gaussian for sigma:
//
//   edgeScore = exp( -(halfBand² / (2σ²)) )
//   σ = halfBand / sqrt( -2 · ln(edgeScore) )
//
const gaussianScore = (
  value:     number,
  min:       number,
  max:       number,
  edgeScore: number = 0.60,   // score at the exact band boundary (0 < edgeScore < 1)
): number => {
  const mid      = (min + max) / 2;
  const halfBand = (max - min) / 2;                         // distance from mid to edge
  const sigma    = halfBand / Math.sqrt(-2 * Math.log(edgeScore));
  const raw      = Math.exp(-((value - mid) ** 2) / (2 * sigma ** 2));
  return Math.min(100, Math.max(0, raw * 100));
};

// ─── Continuous Soil Quality Index (SQI) — 0–100 ─────────────────────────
//
// Each metric is scored on a Gaussian bell-curve (peak = 100 at the range
// midpoint, smooth decay towards 0 for outliers).
//
// Weights reflect agronomic priority for a typical mixed-crop context:
//   pH (25) · EC (20) · N (15) · P (15) · K (15) · T (5) · H (5)  = 100
//
// EC unit note: sensor streams µS/cm — divide by 1000 before scoring.
//
const calculateHealthScore = (data: DisplayedSensorData): number => {

  // ── Zero-state / sensor-offline guard ──────────────────────────────────
  const isSensorOffline =
    data.nitrogen   === 0 &&
    data.phosphorus === 0 &&
    data.potassium  === 0 &&
    data.ph         === 0 &&
    data.ec         === 0;

  if (isSensorOffline) return 0;

  // ── EC: sensor sends µS/cm → convert to mS/cm ─────────────────────────
  const ecMsCm = data.ec / 1000;

  // ── Weighted metric table ──────────────────────────────────────────────
  //   { weight, score }  —  weights must sum to 100
  const metrics = [
    { weight: 25, score: gaussianScore(data.ph,         5.8,  6.5)  },   // pH
    { weight: 20, score: gaussianScore(ecMsCm,          0.2,  1.2)  },   // EC  (mS/cm)
    { weight: 15, score: gaussianScore(data.nitrogen,   50,   150)  },   // N
    { weight: 15, score: gaussianScore(data.phosphorus, 36,   50)   },   // P
    { weight: 15, score: gaussianScore(data.potassium,  131,  175)  },   // K
    { weight:  5, score: gaussianScore(data.soilTemp,   20,   30)   },   // Temperature
    { weight:  5, score: gaussianScore(data.humidity,   40,   70)   },   // Humidity
  ];

  // ── Weighted average → integer SQI ────────────────────────────────────
  const totalWeight   = metrics.reduce((sum, m) => sum + m.weight,         0);  // 100
  const weightedScore = metrics.reduce((sum, m) => sum + m.weight * m.score, 0);

  return Math.round(weightedScore / totalWeight);
};

// ─── Display status badge — driven by the same SOIL_THRESHOLDS ────────────
const getStatus = (
  key: string,
  val: number
): "good" | "optimal" | "high" | "low" | "moderate" => {
  const thresholdMap: Record<string, ThresholdKey> = {
    nitrogen:   "N",
    phosphorus: "P",
    potassium:  "K",
    ph:         "pH",
    soilTemp:   "T",
    humidity:   "H",
    ec:         "EC",
  };

  const thresholdKey = thresholdMap[key];
  if (!thresholdKey) return "good";

  // EC arrives in µS/cm from the sensor — normalise before comparing
  const normalised = key === "ec" ? val / 1000 : val;
  const { min, max } = SOIL_THRESHOLDS[thresholdKey];

  if (normalised >= min && normalised <= max) {
    return key === "humidity" ? "good" : "optimal";
  }
  return normalised < min ? "low" : "high";
};

const prepareRadarData = (data: DisplayedSensorData) => {
  return [
    { name: "N",        value: Math.min(100, (data.nitrogen / 300) * 100),    fullMark: 100 },
    { name: "P",        value: Math.min(100, (data.phosphorus / 40) * 100),   fullMark: 100 },
    { name: "K",        value: Math.min(100, (data.potassium / 250) * 100),   fullMark: 100 },
    { name: "pH",       value: Math.min(100, ((data.ph / 8) * 100)),          fullMark: 100 },
    { name: "Temp",     value: Math.min(100, ((data.soilTemp / 40) * 100)),   fullMark: 100 },
    { name: "Humidity", value: data.humidity,                                  fullMark: 100 },
    { name: "EC",       value: Math.min(100, ((data.ec / 2000) * 100)),       fullMark: 100 },
  ];
};

const prepareComparisonData = (data: DisplayedSensorData) => {
  return [
    { name: "Nitrogen",    current: data.nitrogen,     optimal: 100, max: 300 },
    { name: "Phosphorus",  current: data.phosphorus,   optimal: 43,  max: 60  },
    { name: "Potassium",   current: data.potassium,    optimal: 153, max: 250 },
    { name: "pH",          current: data.ph * 10,      optimal: 62,  max: 80  },
    { name: "Temperature", current: data.soilTemp,     optimal: 25,  max: 40  },
    { name: "Humidity",    current: data.humidity,     optimal: 55,  max: 100 },
    { name: "EC",          current: data.ec / 1000,    optimal: 0.7, max: 2   },
  ];
};

// ─── Unified score color helper (Cornell CASH bands) ──────────────────────
const getScoreColorClasses = (score: number): { text: string; stroke: string } => {
  if (score < 40) return { text: "text-red-500",     stroke: "#ef4444" };
  if (score < 60) return { text: "text-orange-500",  stroke: "#f97316" };
  if (score < 80) return { text: "text-emerald-500", stroke: "#10b981" };
  return             { text: "text-green-600",    stroke: "#16a34a" };
};

export default function Dashboard() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [data, setData] = useState<DisplayedSensorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cropRecs, setCropRecs] = useState<CropRecommendationItem[]>([]);
  const [cropSummary, setCropSummary] = useState<string>("");
  const [cropLoading, setCropLoading] = useState(true);
  const [cropError, setCropError] = useState<string | null>(null);

  const fetchSensorData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const reading = await sensorService.getLatest();
      setData(transformSensorData(reading));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("failedToFetchData")
      );
      console.error("Failed to fetch sensor data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCropRecommendations = async () => {
    try {
      setCropLoading(true);
      setCropError(null);
      const res = await chatService.getCropRecommendations();
      setCropRecs(res.recommendations ?? []);
      setCropSummary(res.summary ?? "");
    } catch (err) {
      setCropError(err instanceof Error ? err.message : "Failed to load crop recommendations");
    } finally {
      setCropLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
    fetchCropRecommendations();
    const interval = setInterval(fetchSensorData, 30000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { key: "nitrogen",   icon: Sprout,       label: t("nitrogen"),   value: data?.nitrogen   || 0, unit: t("mgPerKg"), color: "bg-primary/10 text-primary",         idealRange: `${SOIL_THRESHOLDS.N.min}-${SOIL_THRESHOLDS.N.max}`   },
    { key: "phosphorus", icon: FlaskConical,  label: t("phosphorus"), value: data?.phosphorus || 0, unit: t("mgPerKg"), color: "bg-info/10 text-info",               idealRange: `${SOIL_THRESHOLDS.P.min}-${SOIL_THRESHOLDS.P.max}`   },
    { key: "potassium",  icon: Zap,           label: t("potassium"),  value: data?.potassium  || 0, unit: t("mgPerKg"), color: "bg-warning/10 text-warning",         idealRange: `${SOIL_THRESHOLDS.K.min}-${SOIL_THRESHOLDS.K.max}`   },
    { key: "ph",         icon: Gauge,         label: t("ph"),         value: data?.ph         || 0, unit: "",           color: "bg-accent text-accent-foreground",   idealRange: `${SOIL_THRESHOLDS.pH.min}-${SOIL_THRESHOLDS.pH.max}` },
    { key: "soilTemp",   icon: Thermometer,   label: t("soilTemp"),   value: data?.soilTemp   || 0, unit: t("celsius"), color: "bg-destructive/10 text-destructive", idealRange: `${SOIL_THRESHOLDS.T.min}-${SOIL_THRESHOLDS.T.max}`   },
    { key: "humidity",   icon: Droplets,      label: t("humidity"),   value: data?.humidity   || 0, unit: t("percent"), color: "bg-info/10 text-info",               idealRange: `${SOIL_THRESHOLDS.H.min}-${SOIL_THRESHOLDS.H.max}`   },
    { key: "ec",         icon: Wind,          label: t("ec"),         value: data?.ec         || 0, unit: t("msPerCm"), color: "bg-success/10 text-success",         idealRange: `${SOIL_THRESHOLDS.EC.min}-${SOIL_THRESHOLDS.EC.max}` },
  ];

  const healthScore = data ? calculateHealthScore(data) : 0;

  return (
    <div className="max-w-7xl mx-auto relative z-10">

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-12"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">{t("loadingSensorData")}</span>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Main Content */}
      {!isLoading && data && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6 lg:mb-8 px-0.5"
          >
            <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{t("sensorOverview")}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{t("realTimeMonitoring")}</p>
          </motion.div>

          {/* Soil Health Score */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="metric-card mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-card/90 backdrop-blur-md p-4 sm:p-6 rounded-lg"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-2xl sm:text-3xl font-bold text-primary">{healthScore}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">{t("soilHealthScore")}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {healthScore >= 80 ? t("excellent") : healthScore >= 60 ? t("good") : t("needsImprovement")} - {t("realTimeMonitoring")}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <span className="live-dot" />
              <span className="text-xs font-semibold text-success uppercase tracking-wider">{t("live")}</span>
            </div>
          </motion.div>

          {/* AI Advisor CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card
              className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate("/ai-advisor")}
            >
              <CardContent className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-1 sm:mt-0">
                    <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-foreground">{t("getAiRecommendationTitle")}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{t("getAiRecommendationDescription")}</p>
                  </div>
                </div>
                <div className="w-full sm:w-auto mt-2 sm:mt-0">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/ai-advisor");
                    }}
                    className="w-full sm:w-auto whitespace-nowrap text-xs sm:text-sm"
                  >
                    {t("openAiAdvisor")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {metrics.map((m, i) => (
              <MetricCard
                key={m.key}
                icon={m.icon}
                label={m.label}
                value={m.value}
                unit={m.unit}
                status={getStatus(m.key, m.value)}
                color={m.color}
                index={i}
                idealRange={m.idealRange}
              />
            ))}

            {/* 8th Card: Top 3 Recommended Crops */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: metrics.length * 0.08 }}
              className="relative overflow-hidden rounded-xl border border-emerald-200 dark:border-emerald-900 shadow-md flex flex-col"
              style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)" }}
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-teal-400/20 blur-xl pointer-events-none" />

              <div className="relative flex items-center gap-2 px-4 pt-4 pb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm shrink-0">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-emerald-900 leading-tight">{t("topRecommendedCrops")}</p>
                  <p className="text-[9px] text-emerald-700 font-medium">{t("basedOnLiveSensorData")}</p>
                </div>
              </div>

              <div className="mx-4 h-px bg-emerald-200/70" />

              <div className="relative flex-1 px-4 py-3 space-y-2">
                {cropLoading ? (
                  <div className="flex items-center gap-2 text-emerald-700 text-xs py-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="font-medium">{t("analyzingSoilData")}</span>
                  </div>
                ) : cropError ? (
                  <div className="flex items-start gap-1.5">
                    <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-red-600 leading-tight">{cropError}</p>
                  </div>
                ) : (
                  <>
                    {cropRecs.slice(0, 3).map((crop, idx) => {
                      const translatedName = translateDynamicText(crop.name, language);
                      const translatedReason = crop.reason ? translateDynamicText(crop.reason, language) : "";
                      const medals = ["🥇", "🥈", "🥉"];
                      const bgColors = [
                        "bg-yellow-100/80 border-yellow-300",
                        "bg-gray-100/80 border-gray-300",
                        "bg-orange-100/80 border-orange-300",
                      ];
                      return (
                        <div
                          key={crop.rank}
                          className={`flex items-start gap-2 rounded-lg border px-2.5 py-1.5 backdrop-blur-sm ${bgColors[idx]}`}
                        >
                          <span className="text-base leading-none mt-0.5">{medals[idx]}</span>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-gray-900 truncate">{translatedName}</p>
                            {translatedReason && (
                              <p className="text-[9px] text-gray-600 leading-tight line-clamp-1 mt-0.5">{translatedReason}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {cropSummary && (
                      <p className="text-[9px] text-emerald-800 pt-1 leading-snug line-clamp-2 italic">
                        {translateDynamicText(cropSummary, language)}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="relative px-4 pb-4">
                <button
                  onClick={() => navigate("/ai-advisor")}
                  className="w-full py-2 rounded-lg text-xs font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "linear-gradient(90deg, #059669, #10b981)" }}
                >
                  {t("getMoreInfo")}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 sm:mt-12 space-y-4 sm:space-y-6"
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-bold text-foreground">{t("analytics")}</h2>
            </div>

            {/* Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">{t("sensorMetricsOverview")}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">{t("normalizedReadings")}</CardDescription>
              </CardHeader>
              <CardContent className="w-full overflow-x-auto">
                <div className="min-h-[250px] sm:min-h-[320px] md:min-h-[400px] w-full">
                  <ResponsiveContainer width="100%" height={typeof window !== 'undefined' ? (window.innerWidth < 640 ? 250 : window.innerWidth < 768 ? 320 : 400) : 400}>
                    <RadarChart data={prepareRadarData(data)}>
                      <PolarGrid stroke="hsl(var(--muted-foreground))" opacity={0.2} />
                      <PolarAngleAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 12 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                      <Radar
                        name={t("current")}
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">{t("currentVsOptimalLevels")}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">{t("comparisonValues")}</CardDescription>
              </CardHeader>
              <CardContent className="w-full overflow-x-auto">
                <div className="min-h-[250px] sm:min-h-[300px] md:min-h-[350px] w-full">
                  <ResponsiveContainer width="100%" height={typeof window !== 'undefined' ? (window.innerWidth < 640 ? 250 : window.innerWidth < 768 ? 300 : 350) : 350}>
                    <BarChart data={prepareComparisonData(data)} margin={{ top: 20, right: 20, left: 0, bottom: typeof window !== 'undefined' && window.innerWidth < 640 ? 80 : 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={typeof window !== 'undefined' && window.innerWidth < 640 ? 100 : 100}
                        tick={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 12 }}
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 12,
                        }}
                        cursor={{ fill: "hsl(var(--primary))", opacity: 0.1 }}
                      />
                      <Legend wrapperStyle={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 12 }} />
                      <Bar dataKey="current" fill="hsl(var(--primary))" name={t("current")} radius={[8, 8, 0, 0]} />
                      <Bar dataKey="optimal" fill="hsl(var(--success))" name={t("optimal")} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Health Score Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">{t("soilHealthStatus")}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">{t("detailedHealthAssessment")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                  {/* Score Circle */}
                  <div className="flex flex-col items-center justify-center py-4 sm:py-0">
                    {/* <svg
                      width={typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 140}
                      height={typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 140}
                      viewBox="0 0 120 120"
                    >
                      <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                      <circle
                        cx="60" cy="60" r="50" fill="none"
                        stroke={healthScore >= 80 ? "hsl(var(--success))" : healthScore >= 60 ? "hsl(var(--warning))" : "hsl(var(--destructive))"}
                        strokeWidth="8"
                        strokeDasharray={`${(healthScore / 100) * 314.16} 314.16`}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                      />
                      <text x="60" y="56" textAnchor="middle" dominantBaseline="middle"
                        style={{ fontSize: '22px', fontWeight: 700, fill: 'hsl(var(--primary))', fontFamily: 'inherit' }}
                      >
                        {healthScore}%
                      </text>
                      <text x="60" y="76" textAnchor="middle" dominantBaseline="middle"
                        style={{ fontSize: '10px', fill: 'hsl(var(--muted-foreground))', fontFamily: 'inherit' }}
                      >
                        {t("healthScoreLabel")}
                      </text>
                    </svg>
                    {(() => {
                      const statusConfig =
                        healthScore < 40
                          ? { label: "Very Low",         color: "text-red-500"     }
                          : healthScore < 60
                          ? { label: "Medium",           color: "text-yellow-500"  }
                          : healthScore < 80
                          ? { label: "High",             color: "text-emerald-500" }
                          : { label: "Very High (Ideal)", color: "text-primary"    };

                      return (
                        <div className="mt-3 flex flex-col items-center gap-1">
                          <p className="text-xs text-muted-foreground text-center">
                            Status:{" "}
                            <span className={`font-bold ${statusConfig.color}`}>
                              {statusConfig.label}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground text-center">
                            Ideal Target Score:{" "}
                            <span className="font-bold text-primary">80 – 100</span>
                          </p>
                        </div>
                      );
                    })()} */}
                    {(() => {
                      const scoreColors = getScoreColorClasses(healthScore);
                      const statusLabel =
                        healthScore < 40 ? "Very Low"
                        : healthScore < 60 ? "Medium"
                        : healthScore < 80 ? "High"
                        : "Very High (Ideal)";

                      return (
                        <>
                          <svg
                            width={typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 140}
                            height={typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 140}
                            viewBox="0 0 120 120"
                          >
                            {/* Track ring */}
                            <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                            {/* Progress ring — color synced via helper */}
                            <circle
                              cx="60" cy="60" r="50" fill="none"
                              stroke={scoreColors.stroke}
                              strokeWidth="8"
                              strokeDasharray={`${(healthScore / 100) * 314.16} 314.16`}
                              strokeLinecap="round"
                              transform="rotate(-90 60 60)"
                            />
                            {/* Percentage text — fill synced via helper */}
                            <text x="60" y="56" textAnchor="middle" dominantBaseline="middle"
                              style={{ fontSize: '22px', fontWeight: 700, fill: scoreColors.stroke, fontFamily: 'inherit' }}
                            >
                              {healthScore}%
                            </text>
                            <text x="60" y="76" textAnchor="middle" dominantBaseline="middle"
                              style={{ fontSize: '10px', fill: 'hsl(var(--muted-foreground))', fontFamily: 'inherit' }}
                            >
                              {t("healthScoreLabel")}
                            </text>
                          </svg>

                          {/* Status + target row — text color synced via helper */}
                          <div className="mt-3 flex flex-col items-center gap-1">
                            <p className="text-xs text-muted-foreground text-center">
                              Status:{" "}
                              <span className={`font-bold ${scoreColors.text}`}>
                                {statusLabel}
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground text-center">
                              Ideal Target Score:{" "}
                              <span className="font-bold text-primary">80 – 100</span>
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Status Cards */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="p-2 sm:p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="text-xs text-muted-foreground mb-1">{t("nutrients")}</div>
                      <div className="text-sm sm:text-base font-semibold">
                        {getStatus("nitrogen", data.nitrogen) === "optimal" ? t("optimal") : t(getStatus("nitrogen", data.nitrogen))}
                      </div>
                    </div>
                    <div className="p-2 sm:p-3 rounded-lg bg-warning/5 border border-warning/20">
                      <div className="text-xs text-muted-foreground mb-1">{t("ph")}</div>
                      <div className="text-sm sm:text-base font-semibold">
                        {getStatus("ph", data.ph) === "optimal" ? t("ideal") : t(getStatus("ph", data.ph))}
                      </div>
                    </div>
                    <div className="p-2 sm:p-3 rounded-lg bg-info/5 border border-info/20">
                      <div className="text-xs text-muted-foreground mb-1">{t("moisture")}</div>
                      <div className="text-sm sm:text-base font-semibold">
                        {getStatus("humidity", data.humidity) === "good" ? t("good") : t(getStatus("humidity", data.humidity))}
                      </div>
                    </div>
                  </div>

                  {/* Metrics Summary */}
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                      <span className="text-muted-foreground">{t("nitrogen")}</span>
                      <span className="font-semibold truncate">{data.nitrogen} {t("mgPerKg")}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                      <span className="text-muted-foreground">{t("phosphorus")}</span>
                      <span className="font-semibold truncate">{data.phosphorus} {t("mgPerKg")}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                      <span className="text-muted-foreground">{t("potassium")}</span>
                      <span className="font-semibold truncate">{data.potassium} {t("mgPerKg")}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                      <span className="text-muted-foreground">{t("temperature")}</span>
                      <span className="font-semibold truncate">{data.soilTemp}{t("celsius")}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                      <span className="text-muted-foreground">{t("humidity")}</span>
                      <span className="font-semibold truncate">{data.humidity}{t("percent")}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                      <span className="text-muted-foreground">{t("ph")}</span>
                      <span className="font-semibold truncate">{data.ph}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                      <span className="text-muted-foreground">{t("ec")}</span>
                      <span className="font-semibold truncate text-xs">
                        {(data.ec / 1000).toFixed(2)} mS/cm
                      </span>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}

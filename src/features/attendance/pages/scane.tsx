import { useEffect, useRef, useState, useCallback } from "react";
import { speak } from "@/utils/speech";
import { generateQrFromText } from "@/utils/qrGenerator";
import { useQrScanner } from "@/features/attendance/hooks/useQrScanner";
import type Student from "../types/studentType";
import { attendanceService } from "../services/attendanceService";
import RecentScanSkeleton from "../components/recentScanSkeleton";

export default function Scane() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [loadingRecent, setLoadingRecent] = useState(false);

    const [scannedUser, setScannedUser] = useState<Student | null>(null);
    const [errorUser, setErrorUser] = useState<any>(null);
    const [recentScans, setRecentScans] = useState<any[]>([]);
    const [generatedQR, setGeneratedQR] = useState<string | null>(null);

    const studentsRef = useRef(students);
    const scanLockRef = useRef(false);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoadingStudents(true);
            const data = await attendanceService.getStudents();
            setStudents(data);
            setLoadingStudents(false);
        };

        fetchStudents();
    }, []);

    useEffect(() => {
        studentsRef.current = students;
    }, [students]);

    const totalParticipants = students.length;
    const attendanceCount = students.filter(s => s.attendance).length;

    const handleScan = useCallback(async (decodedText: string) => {
        if (scanLockRef.current) return;
        scanLockRef.current = true;

        const result = await attendanceService.checkAttendance(
            studentsRef.current,
            decodedText
        );

        if (result.status === "NOT_FOUND") {
            speak("QR tidak valid", () => {
                scanLockRef.current = false;
            });

            setErrorUser({ message: "QR Tidak Valid" });
            setTimeout(() => setErrorUser(null), 3000);
            return;
        }

        if (result.status === "ALREADY_ATTEND") {
            speak(`${result.student?.name} sudah melakukan absensi`, () => {
                scanLockRef.current = false;
            });

            setErrorUser({
                name: result.student?.name,
                nisn: result.student?.nisn,
                message: "Sudah melakukan absensi",
            });

            setTimeout(() => setErrorUser(null), 3000);
            return;
        }

        if (result.status === "SUCCESS") {
            setLoadingRecent(true);

            setStudents(result.updatedStudents || []);

            const time = new Date().toLocaleTimeString();

            speak(`Absensi berhasil. Selamat Datang ${result.student?.name}`, () => {
                scanLockRef.current = false;
            });

            setScannedUser(result.student || null);

            setTimeout(() => {
                setRecentScans(prev => [
                    { ...result.student, time },
                    ...prev
                ]);

                setLoadingRecent(false);
            }, 700);

            setTimeout(() => {
                setScannedUser(null);
            }, 3000);
        }

    }, []);

    useQrScanner("qr-reader", handleScan);

    const generateQR = async () => {
        const randomStudent =
            students[Math.floor(Math.random() * students.length)];

        const qrDataUrl = await generateQrFromText(randomStudent.nisn);

        setGeneratedQR(qrDataUrl);
    };

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* SCANNER */}
                <div className="lg:col-span-8 space-y-6">
                    <div
                        id="qr-reader"
                        className="relative aspect-video bg-black rounded-xl overflow-hidden ring-1 ring-slate-200 shadow-2xl"
                    >
                        {scannedUser && (
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-50">
                                <div className="bg-green-500 text-white p-4 rounded-xl shadow-lg">
                                    <p className="font-bold">Absensi Sukses</p>
                                    <p>{scannedUser.name} - {scannedUser.nisn}</p>
                                </div>
                            </div>
                        )}

                        {errorUser && (
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-50">
                                <div className="bg-red-500 text-white p-4 rounded-xl shadow-lg">
                                    <p className="font-bold">
                                        {errorUser.name
                                            ? `${errorUser.name} - ${errorUser.nisn}`
                                            : errorUser.message}
                                    </p>
                                    {errorUser.name && (
                                        <p className="text-sm">{errorUser.message}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={generateQR}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg"
                    >
                        Generate QR Dummy
                    </button>

                    {generatedQR && (
                        <div className="mt-4">
                            <img src={generatedQR} alt="QR" className="w-40 h-40" />
                        </div>
                    )}
                </div>

                {/* SIDEBAR INFO */}
                <div className="lg:col-span-4 space-y-6">

                    <div className="bg-primary rounded-xl p-6 text-white">
                        <p className="text-sm font-bold uppercase mb-4">
                            Progres Sesi
                        </p>

                        <div className="flex items-end justify-between mb-2">
                            <div className="text-4xl font-black">
                                {attendanceCount}
                                <span className="text-lg opacity-60">
                                    {" "} / {totalParticipants}
                                </span>
                            </div>

                            <div className="text-sm font-bold bg-white/20 px-2 py-1 rounded">
                                {Math.round((attendanceCount / totalParticipants) * 100)}%
                            </div>
                        </div>

                        <div className="w-full bg-white/20 rounded-full h-2">
                            <div
                                className="bg-white h-2 rounded-full"
                                style={{
                                    width: `${(attendanceCount / totalParticipants) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
                        <div className="p-4 border-b border-slate-200">
                            <h3 className="font-bold text-sm uppercase text-slate-500">
                                Recently Scanned
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {loadingRecent && <RecentScanSkeleton />}

                            {!loadingRecent && recentScans.length === 0 && (
                                <div className="text-center text-sm text-slate-400 py-4">
                                    No recent scans
                                </div>
                            )}

                            {!loadingRecent && recentScans.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                        👤
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium">
                                            {item.class} • {item.nisn}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-green-500">
                                            SUCCESS
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            {item.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
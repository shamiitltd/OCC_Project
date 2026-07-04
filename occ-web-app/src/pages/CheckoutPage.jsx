import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ApiClient from '../services/api-client';

export default function CheckoutPage() {
    const [searchParams] = useSearchParams();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [step, setStep] = useState(1); // 1: Select, 2: Details/Payment, 3: Success
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        college: '',
        year: '3rd Year'
    });
    const [paymentMethod, setPaymentMethod] = useState('upi'); // upi, card, netbanking
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [bankSelect, setBankSelect] = useState('');
    
    const [discountCode, setDiscountCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [successData, setSuccessData] = useState(null);

    useEffect(() => {
        // Load courses
        const loadCourses = async () => {
            try {
                const list = await ApiClient.getCoursesPublic();
                setCourses(list);
                
                // Check if courseId is passed in URL
                const courseId = searchParams.get('course') || searchParams.get('courseId');
                if (courseId) {
                    const matched = list.find(c => c.id === courseId);
                    if (matched) {
                        setSelectedCourse(matched);
                        setStep(2);
                    }
                }
            } catch (err) {
                console.error("Failed to load courses", err);
            }
        };
        loadCourses();
    }, [searchParams]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    };

    const handleSelectCourse = (course) => {
        setSelectedCourse(course);
        setStep(2);
    };

    const handleApplyDiscount = () => {
        if (!selectedCourse) return;
        const code = discountCode.trim().toUpperCase();
        if (code === 'OC2FIRST' || code === 'WELCOME10') {
            setDiscountAmount(Math.round(selectedCourse.price * 0.1));
            if (window.OC2?.Toast) window.OC2.Toast.success('10% discount applied!');
        } else if (code === 'LAUNCH20') {
            setDiscountAmount(Math.round(selectedCourse.price * 0.2));
            if (window.OC2?.Toast) window.OC2.Toast.success('20% discount applied!');
        } else {
            setDiscountAmount(0);
            if (window.OC2?.Toast) window.OC2.Toast.error('Invalid discount code.');
        }
    };

    const handlePay = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone || !formData.college) {
            if (window.OC2?.Toast) window.OC2.Toast.error('Please fill in all required details.');
            return;
        }

        setProcessing(true);
        const subTotal = selectedCourse.price - discountAmount;
        const total = Math.round(subTotal * 1.18);

        try {
            const res = await ApiClient.checkout({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                college: formData.college,
                year: formData.year,
                courseId: selectedCourse.id,
                amount: total,
                method: paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Card' : 'Net Banking'
            });

            setSuccessData(res);
            setStep(3);
            if (window.OC2?.Toast) window.OC2.Toast.success('Enrollment successful!');
        } catch (err) {
            if (window.OC2?.Toast) window.OC2.Toast.error(err.message || 'Checkout failed.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="public-page">
            {/* Page Hero */}
            <section className="page-hero" style={{ paddingBottom: 'var(--space-xl)' }}>
                <div className="hero-bg"></div>
                <div className="container">
                    <span className="section-label">// Checkout</span>
                    <h1 style={{ marginTop: 'var(--space-md)' }}><span className="text-gradient">Secure</span> Enrollment</h1>
                    {/* Steps Header */}
                    <div className="checkout-steps" style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', marginTop: 'var(--space-xl)', alignItems: 'center' }}>
                        <div className={`checkout-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step >= 1 ? 1 : 0.5 }}>
                            <span className="step-number" style={{ background: step > 1 ? 'var(--accent-green)' : 'var(--brand-primary)', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>{step > 1 ? '✓' : '1'}</span>
                            <span>Course</span>
                        </div>
                        <div style={{ width: '40px', height: '1px', background: 'var(--border-subtle)' }}></div>
                        <div className={`checkout-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step >= 2 ? 1 : 0.5 }}>
                            <span className="step-number" style={{ background: step > 2 ? 'var(--accent-green)' : step === 2 ? 'var(--brand-primary)' : 'var(--bg-surface-alt)', color: step >= 2 ? '#fff' : 'var(--text-muted)', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>{step > 2 ? '✓' : '2'}</span>
                            <span>Details</span>
                        </div>
                        <div style={{ width: '40px', height: '1px', background: 'var(--border-subtle)' }}></div>
                        <div className={`checkout-step ${step >= 3 ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step >= 3 ? 1 : 0.5 }}>
                            <span className="step-number" style={{ background: step === 3 ? 'var(--accent-green)' : 'var(--bg-surface-alt)', color: step === 3 ? '#fff' : 'var(--text-muted)', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>3</span>
                            <span>Payment</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" style={{ paddingTop: 'var(--space-lg)' }}>
                <div className="container">
                    {/* STEP 1: Select Program */}
                    {step === 1 && (
                        <div>
                            <div className="section-header" style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
                                <h3>Select a <span className="text-gradient">Program</span></h3>
                            </div>
                            <div className="grid grid-3 gap-lg" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
                                {courses.map(c => (
                                    <div key={c.id} className="card" style={{ cursor: 'pointer', padding: 'var(--space-xl)', border: '1px solid var(--border-color)' }} onClick={() => handleSelectCourse(c)}>
                                        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>{c.icon}</div>
                                        <span className="badge badge-outline" style={{ marginBottom: 'var(--space-sm)' }}>{c.category}</span>
                                        <h4 style={{ marginBottom: 'var(--space-sm)', fontWeight: 700 }}>{c.title}</h4>
                                        <p className="text-sm" style={{ marginBottom: 'var(--space-lg)', color: 'var(--text-secondary)' }}>{c.duration} · {c.level}</p>
                                        <span style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontSpread: 'normal', fontWeight: 800 }}>{formatCurrency(c.price)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Details + Payment */}
                    {step === 2 && selectedCourse && (
                        <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--space-2xl)' }}>
                            {/* Left: Form details */}
                            <div>
                                {/* Details Card */}
                                <div className="card" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-xl)' }}>
                                    <h3 style={{ marginBottom: 'var(--space-xl)' }}>👤 Your Details</h3>
                                    <form onSubmit={handlePay}>
                                        <div className="grid grid-2 gap-lg" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                                            <div className="form-group">
                                                <label className="form-label">Full Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Your full name"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Email *</label>
                                                <input
                                                    type="email"
                                                    className="form-input"
                                                    placeholder="you@example.com"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-2 gap-lg" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginTop: 'var(--space-md)' }}>
                                            <div className="form-group">
                                                <label className="form-label">Phone *</label>
                                                <input
                                                    type="tel"
                                                    className="form-input"
                                                    placeholder="+91 XXXXX XXXXX"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">College *</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Your college name"
                                                    value={formData.college}
                                                    onChange={e => setFormData({ ...formData, college: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
                                            <label className="form-label">Year</label>
                                            <select
                                                className="form-select"
                                                value={formData.year}
                                                onChange={e => setFormData({ ...formData, year: e.target.value })}
                                            >
                                                <option value="1st Year">1st Year</option>
                                                <option value="2nd Year">2nd Year</option>
                                                <option value="3rd Year">3rd Year</option>
                                                <option value="4th Year">4th Year</option>
                                                <option value="Graduated">Graduated</option>
                                            </select>
                                        </div>
                                    </form>
                                </div>

                                {/* Payment Method Card */}
                                <div className="card" style={{ padding: 'var(--space-xl)' }}>
                                    <h3 style={{ marginBottom: 'var(--space-xl)' }}>💳 Payment Method</h3>
                                    <div className="flex" style={{ display: 'flex', marginBottom: 'var(--space-md)' }}>
                                        <button
                                            type="button"
                                            className={`payment-tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                                            onClick={() => setPaymentMethod('upi')}
                                            style={{ flex: 1, padding: 'var(--space-md)', border: '1px solid var(--border-color)', background: paymentMethod === 'upi' ? 'var(--brand-gradient-solid)' : 'var(--bg-surface-alt)', color: paymentMethod === 'upi' ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, borderTopLeftRadius: 'var(--radius-md)', borderBottomLeftRadius: 'var(--radius-md)' }}
                                        >
                                            UPI
                                        </button>
                                        <button
                                            type="button"
                                            className={`payment-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                                            onClick={() => setPaymentMethod('card')}
                                            style={{ flex: 1, padding: 'var(--space-md)', border: '1px solid var(--border-color)', background: paymentMethod === 'card' ? 'var(--brand-gradient-solid)' : 'var(--bg-surface-alt)', color: paymentMethod === 'card' ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}
                                        >
                                            Card
                                        </button>
                                        <button
                                            type="button"
                                            className={`payment-tab-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                                            onClick={() => setPaymentMethod('netbanking')}
                                            style={{ flex: 1, padding: 'var(--space-md)', border: '1px solid var(--border-color)', background: paymentMethod === 'netbanking' ? 'var(--brand-gradient-solid)' : 'var(--bg-surface-alt)', color: paymentMethod === 'netbanking' ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, borderTopRightRadius: 'var(--radius-md)', borderBottomRightRadius: 'var(--radius-md)' }}
                                        >
                                            Net Banking
                                        </button>
                                    </div>

                                    {/* UPI Fields */}
                                    {paymentMethod === 'upi' && (
                                        <div className="payment-tab-content active" style={{ padding: 'var(--space-xl) 0' }}>
                                            <div className="qr-placeholder" style={{ width: '150px', height: '150px', background: 'var(--bg-surface-alt)', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'var(--space-lg) auto', fontSize: '3rem' }}>📱</div>
                                            <p className="text-center text-muted text-sm" style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 'var(--space-lg)', fontSize: '0.85rem' }}>Scan QR or enter UPI ID below</p>
                                            <div className="form-group">
                                                <label className="form-label">UPI ID</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="yourname@upi"
                                                    value={upiId}
                                                    onChange={e => setUpiId(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Card Fields */}
                                    {paymentMethod === 'card' && (
                                        <div className="payment-tab-content active" style={{ padding: 'var(--space-xl) 0' }}>
                                            <div className="form-group">
                                                <label className="form-label">Card Number</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="1234 5678 9012 3456"
                                                    value={cardNumber}
                                                    onChange={e => setCardNumber(e.target.value)}
                                                    maxLength="19"
                                                />
                                            </div>
                                            <div className="card-input-group" style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
                                                <div className="form-group" style={{ flex: 1 }}>
                                                    <label className="form-label">Expiry</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="MM/YY"
                                                        value={cardExpiry}
                                                        onChange={e => setCardExpiry(e.target.value)}
                                                        maxLength="5"
                                                    />
                                                </div>
                                                <div className="form-group" style={{ flex: 1 }}>
                                                    <label className="form-label">CVV</label>
                                                    <input
                                                        type="password"
                                                        className="form-input"
                                                        placeholder="•••"
                                                        value={cardCvv}
                                                        onChange={e => setCardCvv(e.target.value)}
                                                        maxLength="3"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Netbanking Fields */}
                                    {paymentMethod === 'netbanking' && (
                                        <div className="payment-tab-content active" style={{ padding: 'var(--space-xl) 0' }}>
                                            <div className="form-group">
                                                <label className="form-label">Select Bank</label>
                                                <select
                                                    className="form-select"
                                                    value={bankSelect}
                                                    onChange={e => setBankSelect(e.target.value)}
                                                >
                                                    <option value="">Choose your bank...</option>
                                                    <option value="SBI">State Bank of India</option>
                                                    <option value="HDFC">HDFC Bank</option>
                                                    <option value="ICICI">ICICI Bank</option>
                                                    <option value="Axis">Axis Bank</option>
                                                    <option value="Kotak">Kotak Mahindra Bank</option>
                                                    <option value="PNB">Punjab National Bank</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    <button type="button" className="btn btn-primary btn-lg w-full" style={{ marginTop: 'var(--space-xl)' }} onClick={handlePay} disabled={processing}>
                                        {processing ? 'Processing...' : 'Pay Now'} <span className="arrow">→</span>
                                    </button>
                                </div>
                            </div>

                            {/* Right: Order Summary */}
                            <div className="order-summary" style={{ position: 'sticky', top: 'calc(var(--nav-height) + var(--space-xl))' }}>
                                <div className="card" style={{ padding: 'var(--space-xl)' }}>
                                    <h4 style={{ marginBottom: 'var(--space-xl)', fontWeight: 700 }}>🧾 Order Summary</h4>
                                    <div className="flex gap-lg items-center" style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                                        <span style={{ fontSize: '2.5rem' }}>{selectedCourse.icon}</span>
                                        <div>
                                            <h4 style={{ fontWeight: 600 }}>{selectedCourse.title}</h4>
                                            <p className="text-sm text-muted" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedCourse.duration} · {selectedCourse.level}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                                        <span className="text-muted" style={{ color: 'var(--text-muted)' }}>Course Fee</span>
                                        <span>{formatCurrency(selectedCourse.price)}</span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                                            <span className="text-muted" style={{ color: 'var(--text-muted)' }}>Discount</span>
                                            <span style={{ color: 'var(--accent-green)' }}>-{formatCurrency(discountAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                                        <span className="text-muted" style={{ color: 'var(--text-muted)' }}>GST (18%)</span>
                                        <span>{formatCurrency(Math.round((selectedCourse.price - discountAmount) * 0.18))}</span>
                                    </div>

                                    <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 'var(--space-lg)', paddingTop: 'var(--space-lg)' }}>
                                        <div className="form-group">
                                            <label className="form-label">Discount Code</label>
                                            <div className="flex gap-sm" style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Enter code"
                                                    value={discountCode}
                                                    onChange={e => setDiscountCode(e.target.value)}
                                                    style={{ flex: 1 }}
                                                />
                                                <button type="button" className="btn btn-secondary btn-sm" onClick={handleApplyDiscount}>Apply</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ borderTop: '2px solid var(--brand-primary)', paddingValue: '0', paddingTop: 'var(--space-lg)', marginTop: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total</span>
                                        <span style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                                            {formatCurrency(Math.round((selectedCourse.price - discountAmount) * 1.18))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Success */}
                    {step === 3 && successData && (
                        <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)', color: 'var(--accent-green)' }}>✅</div>
                            <h2 style={{ marginBottom: 'var(--space-md)', fontWeight: 700 }}>Payment Successful!</h2>
                            <p style={{ maxWidth: '500px', margin: '0 auto var(--space-xl)', color: 'var(--text-secondary)' }}>
                                Welcome, {successData.student.name}! You're now enrolled in {selectedCourse.title}. Your student portal account is ready.
                            </p>
                            
                            <div className="card" style={{ maxWidth: '500px', margin: '0 auto var(--space-xl)', padding: 'var(--space-xl)', textAlign: 'left', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                                    <span className="text-muted" style={{ color: 'var(--text-muted)' }}>Receipt No</span>
                                    <span className="font-mono" style={{ fontFamily: 'monospace' }}>{successData.payment.receiptNo}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                                    <span className="text-muted" style={{ color: 'var(--text-muted)' }}>Course</span>
                                    <span>{selectedCourse.title}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                                    <span className="text-muted" style={{ color: 'var(--text-muted)' }}>Amount Paid</span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--accent-green)' }}>{formatCurrency(successData.payment.amount)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                                    <span className="text-muted" style={{ color: 'var(--text-muted)' }}>Method</span>
                                    <span>{successData.payment.method}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span className="text-muted" style={{ color: 'var(--text-muted)' }}>Date</span>
                                    <span>{new Date(successData.payment.date).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
                                <Link to="/portal" className="btn btn-primary btn-lg">Go to Student Portal →</Link>
                                <Link to="/training" className="btn btn-secondary btn-lg">Browse More Programs</Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Processing Overlay */}
            {processing && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 5000, background: 'rgba(10, 10, 26, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid var(--border-color)', borderTopColor: 'var(--brand-primary)', animation: 'spin 1s linear infinite' }}></div>
                    <h3 style={{ color: '#fff' }}>Processing Payment...</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Please do not close this window</p>
                </div>
            )}
        </div>
    );
}
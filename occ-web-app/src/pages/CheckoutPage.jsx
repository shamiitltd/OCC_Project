import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function CheckoutPage() {
    const { AppState } = useAppContext();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [step, setStep] = useState(1);
    
    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [college, setCollege] = useState('');
    const [year, setYear] = useState('3rd Year');

    // Payment fields
    const [payTab, setPayTab] = useState('upi');
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [bankSelect, setBankSelect] = useState('');

    // Promo code fields
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        const allCourses = AppState.getCourses(true);
        setCourses(allCourses);

        const courseId = searchParams.get('courseId');
        if (courseId) {
            const matched = allCourses.find(c => c.id === courseId);
            if (matched) {
                setSelectedCourse(matched);
                setStep(2);
            }
        }
    }, [AppState, searchParams]);

    const selectCourse = (course) => {
        setSelectedCourse(course);
        setStep(2);
    };

    const handleApplyPromo = () => {
        const code = promoCode.trim().toUpperCase();
        if (code === 'WELCOME10' || code === 'OC2FIRST') {
            const amt = Math.round((selectedCourse?.price || 0) * 0.10);
            setDiscount(amt);
            alert('Promo code applied successfully! 10% discount added.');
        } else {
            alert('Invalid promo code.');
        }
    };

    const processPayment = (e) => {
        e.preventDefault();
        
        if (!name || !email || !phone || !college) {
            alert('Please fill out all student details before paying.');
            return;
        }

        // Validate payment fields
        if (payTab === 'upi' && !upiId) {
            alert('Please enter your UPI ID.');
            return;
        }
        if (payTab === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
            alert('Please enter your card details.');
            return;
        }
        if (payTab === 'netbanking' && !bankSelect) {
            alert('Please select a bank.');
            return;
        }

        // Complete the registration/enrollment in AppState
        const total = Math.round(((selectedCourse?.price || 0) - discount) * 1.18);
        const result = AppState.enrollInCourse(selectedCourse.id, {
            name,
            email,
            phone,
            college,
            year,
            paymentMethod: payTab,
            paidAmount: total
        });

        if (result) {
            alert(`Enrollment successful! You have successfully enrolled in ${selectedCourse.title}. Total Paid: ₹${total.toLocaleString('en-IN')}`);
            navigate('/training');
        } else {
            alert('Failed to complete enrollment. Please try again.');
        }
    };

    const totalFee = selectedCourse ? selectedCourse.price : 0;
    const gst = Math.round((totalFee - discount) * 0.18);
    const grandTotal = Math.round((totalFee - discount) * 1.18);

    return (
        <div className="checkoutpage-wrapper">
            {/* HERO */}
            <section className="page-hero" style={{ paddingBottom: 'var(--space-xl)' }}>
                <div className="hero-bg"></div>
                <div className="grid-bg"></div>
                <div className="container">
                    <span className="section-label">// Checkout</span>
                    <h1 style={{ marginTop: 'var(--space-md)' }}>Complete Your <span className="text-gradient">Enrollment</span></h1>
                    
                    <div className="checkout-steps" style={{ marginTop: 'var(--space-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-md)' }}>
                        <div className={`checkout-step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
                            <span className="step-number">1</span>
                            <span>Course</span>
                        </div>
                        <div style={{ flex: 1, height: '2px', background: 'var(--border-subtle)', maxWidth: '80px' }}></div>
                        <div className={`checkout-step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
                            <span className="step-number">2</span>
                            <span>Details & Payment</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CHECKOUT BODY */}
            <section className="section" style={{ paddingTop: 'var(--space-lg)' }}>
                <div className="container">
                    
                    {/* STEP 1: SELECT COURSE */}
                    {step === 1 && (
                        <div>
                            <div className="section-header" style={{ marginBottom: 'var(--space-xl)' }}>
                                <h3>Select a <span className="text-gradient">Program</span></h3>
                            </div>
                            <div className="grid grid-3 gap-lg" id="course-select-grid">
                                {courses.map(c => (
                                    <div className="card" style={{ cursor: 'pointer', padding: 'var(--space-lg)' }} onClick={() => selectCourse(c)} key={c.id}>
                                        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>{c.icon}</div>
                                        <span className="badge badge-primary" style={{ marginBottom: 'var(--space-sm)' }}>{c.category}</span>
                                        <h4 style={{ marginBottom: 'var(--space-sm)' }}>{c.title}</h4>
                                        <p className="text-sm" style={{ marginBottom: 'var(--space-lg)', color: 'var(--text-muted)' }}>{c.duration} · {c.level}</p>
                                        <span style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800 }}>₹{c.price.toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: DETAILS & PAYMENT */}
                    {step === 2 && selectedCourse && (
                        <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-xl)' }}>
                            {/* Left Col: Form and Payment */}
                            <div>
                                {/* Student Info */}
                                <div className="card" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-lg)' }}>
                                    <h3 style={{ marginBottom: 'var(--space-xl)' }}>👤 Your Details</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                        <div className="grid grid-2 gap-lg">
                                            <div className="form-group">
                                                <label className="form-label required">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Your full name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label required">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-input"
                                                    placeholder="you@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-2 gap-lg">
                                            <div className="form-group">
                                                <label className="form-label required">Phone</label>
                                                <input
                                                    type="tel"
                                                    className="form-input"
                                                    placeholder="+91 XXXXX XXXXX"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label required">College</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Your college name"
                                                    value={college}
                                                    onChange={(e) => setCollege(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Year of Study</label>
                                            <select
                                                className="form-select"
                                                value={year}
                                                onChange={(e) => setYear(e.target.value)}
                                                style={{ width: '100%' }}
                                            >
                                                <option value="1st Year">1st Year</option>
                                                <option value="2nd Year">2nd Year</option>
                                                <option value="3rd Year">3rd Year</option>
                                                <option value="4th Year">4th Year</option>
                                                <option value="Graduated">Graduated</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Options */}
                                <div className="card" style={{ padding: 'var(--space-lg)' }}>
                                    <h3 style={{ marginBottom: 'var(--space-xl)' }}>💳 Payment Method</h3>
                                    <div className="flex" style={{ marginBottom: 'var(--space-md)', gap: '8px' }}>
                                        <button className={`payment-tab-btn ${payTab === 'upi' ? 'active' : ''}`} onClick={() => setPayTab('upi')} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: payTab === 'upi' ? 'var(--brand-gradient)' : 'var(--bg-surface)', color: payTab === 'upi' ? '#fff' : 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}>UPI</button>
                                        <button className={`payment-tab-btn ${payTab === 'card' ? 'active' : ''}`} onClick={() => setPayTab('card')} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: payTab === 'card' ? 'var(--brand-gradient)' : 'var(--bg-surface)', color: payTab === 'card' ? '#fff' : 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}>Card</button>
                                        <button className={`payment-tab-btn ${payTab === 'netbanking' ? 'active' : ''}`} onClick={() => setPayTab('netbanking')} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: payTab === 'netbanking' ? 'var(--brand-gradient)' : 'var(--bg-surface)', color: payTab === 'netbanking' ? '#fff' : 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}>Net Banking</button>
                                    </div>

                                    {/* UPI fields */}
                                    {payTab === 'upi' && (
                                        <div style={{ padding: 'var(--space-md) 0' }}>
                                            <div style={{ textAlign: 'center', fontSize: '3rem', marginVertical: 'var(--space-md)' }}>📱</div>
                                            <p className="text-center text-muted text-sm" style={{ marginBottom: 'var(--space-lg)' }}>Scan QR or enter UPI ID below</p>
                                            <div className="form-group">
                                                <label className="form-label required">UPI ID</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="yourname@upi"
                                                    value={upiId}
                                                    onChange={(e) => setUpiId(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Card fields */}
                                    {payTab === 'card' && (
                                        <div style={{ padding: 'var(--space-md) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                            <div className="form-group">
                                                <label className="form-label required">Card Number</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="1234 5678 9012 3456"
                                                    value={cardNumber}
                                                    onChange={(e) => setCardNumber(e.target.value)}
                                                    maxLength="19"
                                                />
                                            </div>
                                            <div className="grid grid-2 gap-md">
                                                <div className="form-group">
                                                    <label className="form-label required">Expiry</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="MM/YY"
                                                        value={cardExpiry}
                                                        onChange={(e) => setCardExpiry(e.target.value)}
                                                        maxLength="5"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label required">CVV</label>
                                                    <input
                                                        type="password"
                                                        className="form-input"
                                                        placeholder="•••"
                                                        value={cardCvv}
                                                        onChange={(e) => setCardCvv(e.target.value)}
                                                        maxLength="3"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Net Banking fields */}
                                    {payTab === 'netbanking' && (
                                        <div style={{ padding: 'var(--space-md) 0' }}>
                                            <div className="form-group">
                                                <label className="form-label required">Select Bank</label>
                                                <select
                                                    className="form-select"
                                                    value={bankSelect}
                                                    onChange={(e) => setBankSelect(e.target.value)}
                                                    style={{ width: '100%' }}
                                                >
                                                    <option value="">Choose your bank...</option>
                                                    <option value="SBI">State Bank of India</option>
                                                    <option value="HDFC">HDFC Bank</option>
                                                    <option value="ICICI">ICICI Bank</option>
                                                    <option value="Axis">Axis Bank</option>
                                                    <option value="Kotak">Kotak Mahindra Bank</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    <button onClick={processPayment} className="btn btn-primary btn-lg w-full" style={{ marginTop: 'var(--space-lg)', justifyContent: 'center' }}>
                                        Pay Now — ₹{grandTotal.toLocaleString('en-IN')} <span className="arrow">→</span>
                                    </button>
                                </div>
                            </div>

                            {/* Right Col: Order Summary */}
                            <div className="order-summary">
                                <div className="card" style={{ padding: 'var(--space-lg)' }}>
                                    <h4 style={{ marginBottom: 'var(--space-xl)' }}>🛍️ Order Summary</h4>
                                    
                                    <div className="flex gap-lg items-center" style={{ marginBottom: 'var(--space-lg)' }}>
                                        <span style={{ fontSize: '2.5rem' }}>{selectedCourse.icon}</span>
                                        <div>
                                            <h4 style={{ margin: 0 }}>{selectedCourse.title}</h4>
                                            <p className="text-sm text-muted" style={{ margin: 0 }}>{selectedCourse.duration} · {selectedCourse.level}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-lg)' }}>
                                        <div className="flex justify-between">
                                            <span className="text-muted">Course Fee</span>
                                            <span>₹{totalFee.toLocaleString('en-IN')}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex justify-between" style={{ color: 'var(--accent-green)' }}>
                                                <span>Discount</span>
                                                <span>-₹{discount.toLocaleString('en-IN')}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-muted">GST (18%)</span>
                                            <span>₹{gst.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>

                                    <div style={{ borderTop: '1px solid var(--border-subtle)', marginVertical: 'var(--space-lg)', paddingTop: 'var(--space-lg)' }}>
                                        <div className="flex justify-between">
                                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total</span>
                                            <span style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>

                                    {/* Promo code */}
                                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-lg)' }}>
                                        <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Promo Code</label>
                                        <div className="flex gap-sm">
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="e.g. WELCOME10"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                style={{ flex: 1 }}
                                            />
                                            <button className="btn btn-secondary" onClick={handleApplyPromo}>Apply</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
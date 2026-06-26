# 🧠 QueueStorm Investigator - System State & Knowledge Matrix

## 📊 Current System Architecture Status
- **Current Phase**: Phase 2 Completed 🟩
- **System Stability**: 100% Zero-Crash Bound (Verified)
- **Framework**: Node.js / Express.js / Zod Validation

---

## 🔍 Phase 1 Audit: Base Gateway & Isolation Shield (Completed & Verified)
ফেজ ১-এ আমরা অ্যাপ্লিকেশনের মূল এন্ট্রি পয়েন্ট এবং প্রোডাকশন-গ্রেড ডিফেন্স আর্কিটেকচার তৈরি করেছি।

### ১. টেকনিক্যাল কম্পোনেন্টস:
- **`index.js` (Central Integrator)**: এখানে এক্সপ্রেস সার্ভার ইনিশিয়েট করা হয়েছে। জাজদের প্রথম রিকোয়ারমেন্ট অনুযায়ী একটি ব্লকিং-ফ্রি লাইভনেস প্রোটোকল (`GET /health`) তৈরি করা হয়েছে। 
- **`middlewares/errorHandler.js` (Zero-Crash Shield)**: এটি আমাদের অ্যাপ্লিকেশনের বডিগার্ড। এক্সপ্রেসের রাউটে বা প্রসেসিং লাইনে যেকোনো আনহ্যান্ডেলড এরর (যেমন: `ReferenceError`, `TypeError`, বা API Timeout) হলে এই মিডলওয়্যারটি তা ইন্টারসেপ্ট করে। ফলে নোড থ্রেড ক্র্যাশ বা এক্সিট না করে জাজদের একটি স্ট্যান্ডার্ড `500 Internal Server Error` রিটার্ন করে।

### ২. কেন এই ডিজাইন করা হয়েছে?
হ্যাকাথনের ইভালুয়েশন স্ক্রিপ্ট যখনই কোনো কর্নার কেস দিয়ে ইনপুট পাঠাবে, কোডে কোনো বাগ থাকলে সাধারণ সার্ভার বন্ধ (Exit) হয়ে যায়। আমাদের এই আর্কিটেকচার সার্ভারকে ২৪ ঘণ্টা জ্যান্ত রাখবে এবং প্রতিটি এররকে সেফলি আইসোলেট করবে।

---

## 🛡️ Phase 2 Audit: Strict Inbound Schema Validation (Completed & Verified)
ফেজ ২-এ আমরা ইনপুট ডেটা লেয়ারকে লক করেছি, যেন কোনো মেলফর্মড ডেটা ভেতরের আর্কিটেকচারে ঢুকতে না পারে।

### ১. টেকনিক্যাল কম্পোনেন্টস:
- **`schemas/ticketSchema.js` (The Inbound Ledger Contract)**: জড (`zod`) ব্যবহার করে আমরা ইনকামিং পেলোডের অবজেক্ট ম্যাট্রিক্স ও ট্রানজেকশন হিস্ট্রির এনাম (`enum`) ডিফাইন করেছি। `ticket_id` এবং `complaint` ফিল্ডের টাইপ ও রিকোয়ারমেন্ট এখানে লক করা আছে।
- **`middlewares/validateRequest.js` (The Interceptor Checkpost)**: এটি `/analyze-ticket` রাউটের মেইন প্রসেসিং লাইনের ঠিক আগে বসে। রিকোয়েস্ট বডি আসার সাথে সাথে এটি Zod-এর মাধ্যমে ডেটা স্ক্যান করে।

### ২. জাজদের স্পেসিফিক রিকোয়ারমেন্ট হ্যান্ডলিং (HTTP Codes Matrix):
- **400 Bad Request**: ইনপুট পেলোডে যদি `ticket_id` মিসিং থাকে বা ভুল টাইপ পাঠানো হয়, আমাদের মিডলওয়্যার মেইন রাউটে যাওয়ার আগেই রিকোয়েস্ট আটকে দিয়ে ৪০০ এরর ছুড়ে মারে।
- **422 Unprocessable Entity**: ইনপুটে যদি `ticket_id` ঠিক থাকে কিন্তু `complaint` ফাঁকা (`""`) বা স্পেস দেওয়া থাকে, তবে এটি সেমান্টিক এরর হিসেবে ধরে এবং জাজদের নিয়ম অনুযায়ী ৪২২ এরর কোড রিটার্ন করে।
- **Clean Request Forwarding**: ডেটা পুরোপুরি ভ্যালিড হলে এই লেয়ারটি বাড়তি সব ময়লা ফিল্টার করে ফ্রেশ অবজেক্টটি `req.validatedBody`-তে পুশ করে `next()` কল করে দেয়।

---

## 🎯 Next Architectural Target: Phase 3 (AI Synthesis Engine)
- **লক্ষ্য**: `req.validatedBody` থেকে ফ্রেশ ডেটা নিয়ে সিস্টেম প্রম্পটের সাথে কম্বাইন করা এবং ওপেনএআই (`OpenAI`) ক্লায়েন্টের মাধ্যমে জাজদের চাওয়া নির্দিষ্ট ফরম্যাটে ডেটা বের করে আনা।
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

// 1. Mandatory Readiness Health Check (Judges Sweep Protocol)
app.get('/health', (req, res) => {
    return res.status(200).json({ status: "ok" });
});

// 2. Core Operational Target Gateway - (req, res, next) এখানে একদম ফিক্সড!
app.post('/analyze-ticket', (req, res, next) => {
    try {
        const { ticket_id, complaint } = req.body;

        // Base structural filters before schema interceptor layer
        if (!ticket_id || typeof ticket_id !== 'string') {
            return res.status(400).json({ error: "Malformed Input: 'ticket_id' must be a valid string." });
        }
        if (!complaint || typeof complaint !== 'string' || complaint.trim() === '') {
            return res.status(422).json({ error: "Semantically Invalid: 'complaint' text cannot be empty." });
        }

        // Section 6 Contract Baseline Output Model Mock
        const initialMockPayload = {
            ticket_id: ticket_id, // Must be echoed perfectly
            relevant_transaction_id: null,
            evidence_verdict: "insufficient_data",
            case_type: "other",
            severity: "low",
            department: "customer_support",
            agent_summary: "System initializing. Modular layer structural test matched.",
            recommended_next_action: "Proceed to Phase 2 validation engines.",
            customer_reply: "We have received your ticket. For security, never share your PIN or OTP with anyone.",
            human_review_required: false,
            confidence: 1.0,
            reason_codes: ["initial_modular_pipeline_ok"]
        };

        return res.status(200).json(initialMockPayload);

    } catch (routeError) {
        // Forwarding directly to global handler shield
        next(routeError);
    }
});

// Global Shield Insertion - Must be registered LAST after all routers
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`[Modular Matrix Engine Active] Serving safely on port: ${PORT}`);
});
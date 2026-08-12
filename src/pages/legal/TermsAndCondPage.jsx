import React from "react";


function TermsPage() {

    return (
        <div className="legal-page">
            <div className="legal-container">

                <h1>Terms and Conditions</h1>

                <p className="last-updated">
                    Last Updated: August 2026
                </p>

                <section>
                    <h2>1. Acceptance of Terms</h2>

                    <p>
                        By creating an account, accessing, or using this
                        platform (the "App"), you agree to be bound by these
                        Terms and Conditions ("Terms"). If you do not agree to
                        all of these Terms, you may not access or use the App.
                    </p>
                </section>

                <section>
                    <h2>2. Eligibility & Account Security</h2>

                    <h3>Age Requirement</h3>

                    <p>
                        You must be at least 18 years of age, or the legal age
                        of majority in your jurisdiction, to register an
                        account, place bids, or list items.
                    </p>

                    <h3>Account Responsibility</h3>

                    <p>
                        You are solely responsible for safeguarding your
                        account credentials. All activities, bids, listings,
                        and purchases made through your account are your
                        responsibility.
                    </p>
                </section>

                <section>
                    <h2>3. Bidding & Buyer Obligations</h2>

                    <h3>Binding Bids</h3>

                    <p>
                        Every bid placed is a legally binding offer to purchase
                        the listed item at the submitted amount. Bids cannot be
                        canceled, retracted, or modified once submitted.
                    </p>

                    <h3>Proxy / Auto-Bidding</h3>

                    <p>
                        If you utilize auto-bidding, the system will
                        automatically place incremental bids on your behalf up
                        to your specified maximum limit. Every system-generated
                        bid placed on your behalf is fully binding.
                    </p>

                    <h3>Winning Determination</h3>

                    <p>
                        The highest valid bid recorded by our system at the
                        scheduled closing time, that meets or exceeds any
                        applicable reserve price, will be declared the winning
                        bidder.
                    </p>

                    <h3>System Latency Disclaimer</h3>

                    <p>
                        The platform is not responsible for delayed, lost, or
                        failed bids resulting from network latency, internet
                        outages, or device failure.
                    </p>
                </section>

                <section>
                    <h2>4. Payments, Platform Fees & Seller Earnings</h2>

                    <h3>Platform Fee</h3>

                    <p>
                        The App charges a 25% platform fee on the final gross
                        sale price, or winning bid, of every completed auction.
                        This fee is automatically deducted from the gross sale
                        price before issuing net earnings to the seller.
                    </p>

                    <h3>Seller Net Payout</h3>

                    <p>
                        Sellers receive 75% of the gross sale price, less any
                        third-party payment processing fees or agreed-upon
                        seller-funded shipping costs.
                    </p>

                    <h3>Buyer Payment Window</h3>

                    <p>
                        Winning bidders must pay the full amount due, including
                        the winning bid plus applicable taxes and shipping,
                        within 48 hours of auction completion.
                    </p>

                    <h3>Non-Payment</h3>

                    <p>
                        If a buyer fails to complete payment within the
                        deadline, the sale is voided, no platform fee is charged
                        to the seller, and the item may be offered to the next
                        highest bidder or relisted.
                    </p>
                </section>

                <section>
                    <h2>5. Strict No Refund Policy</h2>

                    <h3>All Sales Final</h3>

                    <p>
                        Every transaction, bid, and purchase on the App is
                        strictly non-refundable under any circumstances.
                    </p>

                    <h3>No Returns or Exchanges</h3>

                    <p>
                        Buyers acknowledge and agree that once an auction closes
                        and payment is processed, they are not entitled to a
                        refund, return, return processing, or chargeback. All
                        items are purchased "As-Is."
                    </p>
                </section>

                <section>
                    <h2>6. Proxy Shipping & Delivery</h2>

                    <h3>Third-Party Proxy Fulfillment</h3>

                    <p>
                        Shipping and delivery are handled exclusively via
                        designated proxy shipping providers or third-party
                        logistics services.
                    </p>

                    <h3>Shipping Charges & Risk of Loss</h3>

                    <p>
                        Bidders are solely responsible for all proxy shipping
                        fees, tariffs, customs, and delivery charges. Risk of
                        loss and title for items pass to the buyer once the
                        item is handed over to the proxy shipping carrier.
                    </p>

                    <h3>Delivery Issues</h3>

                    <p>
                        The App is not liable for items damaged, lost, delayed,
                        or stolen while in transit with the proxy shipping
                        service.
                    </p>
                </section>

                <section>
                    <h2>7. Seller Responsibilities & Listing Rules</h2>

                    <h3>Accurate Descriptions</h3>

                    <p>
                        Sellers must accurately describe all items, disclosing
                        all known defects, condition details, and authenticity
                        status.
                    </p>

                    <h3>Shill Bidding Prohibited</h3>

                    <p>
                        Sellers are strictly forbidden from placing bids on
                        their own listings, directly or through third parties,
                        to artificially inflate prices.
                    </p>

                    <h3>Fulfillment</h3>

                    <p>
                        Sellers must release items to the designated proxy
                        shipping service within the agreed timeframe following
                        confirmed payment release.
                    </p>
                </section>

                <section>
                    <h2>8. Platform Role & Limitation of Liability</h2>

                    <h3>Intermediary Status</h3>

                    <p>
                        The App acts as a platform venue facilitating
                        transactions between independent buyers and sellers.
                        We are not a party to the actual contract of sale
                        between buyers and sellers.
                    </p>

                    <h3>As-Is Sales</h3>

                    <p>
                        All items are sold "As-Is." The platform makes no
                        warranties regarding item quality, authenticity, or
                        condition.
                    </p>

                    <h3>Liability Cap</h3>

                    <p>
                        To the maximum extent permitted by law, the platform
                        shall not be liable for any indirect, incidental, or
                        consequential damages arising from your use of the
                        service.
                    </p>
                </section>

                <section>
                    <h2>9. Account Termination</h2>

                    <p>
                        We reserve the right to suspend or permanently terminate
                        any account that violates these Terms, engages in
                        fraudulent behavior, or fails to fulfill payment or
                        delivery obligations.
                    </p>
                </section>

                <section>
                    <h2>10. Governing Law</h2>

                    <p>
                        These Terms are governed by and construed in accordance
                        with applicable local laws, without regard to conflict
                        of law principles.
                    </p>
                </section>

            </div>
        </div>
    );
}


export default TermsPage;
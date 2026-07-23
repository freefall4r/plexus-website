import {
  type BizDoc,
  DOC_LABEL,
  lineTotal,
  subtotal,
  taxAmount,
  grandTotal,
  money,
} from "@/lib/docs/types";
import { PlexusMark } from "@/components/brand/PlexusMark";

// The Plexus house style, lifted from the /invoice skill's shell-template.html
// so documents match exactly. Screen shows a fit-to-width A4; print is true A4.
export const DOC_CSS = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; }
  body { font-family: "Helvetica Neue", Arial, sans-serif; color: #2c271e; background: #9a9488; font-size: 11px; line-height: 1.55; }
  .page { width: 210mm; min-height: 297mm; padding: 16mm 16mm 22mm; background: #f4efe6; position: relative; margin: 0 auto; }
  @media screen { .page { margin: 12px auto; box-shadow: 0 6px 30px rgba(0,0,0,.35); } }
  @media print { body { background:#f4efe6; } .page { box-shadow:none; margin:0; } .noprint { display:none !important; } }
  h1, h2, h3, .brand { font-family: Georgia, "Times New Roman", serif; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2c271e; padding-bottom: 10px; }
  .brand { font-size: 24px; letter-spacing: 4px; font-weight: 700; color: #2c271e; text-transform: uppercase; }
  .brand small { display:block; font-family:"Helvetica Neue",Arial,sans-serif; font-size:8.5px; letter-spacing:3px; color:#9c5b2c; font-weight:600; margin-top:4px; text-transform: uppercase; }
  .head-right { text-align: right; font-size: 9.5px; color:#6b5d4a; line-height:1.6; }
  .head-right b { color:#2c271e; }
  .doctitle { margin: 26px 0 4px; font-size: 19px; color:#2c271e; }
  .doctitle .rule { color:#9c5b2c; }
  .meta-row { display:flex; gap:30px; flex-wrap:wrap; font-size:9.5px; color:#6b5d4a; margin-bottom: 18px; }
  .meta-row b { color:#2c271e; display:block; font-size:8px; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:2px; }
  .sec { margin-top: 22px; }
  .sec-title { font-size: 8.5px; letter-spacing: 2.5px; text-transform: uppercase; color:#9c5b2c; font-weight:700; border-bottom:1px solid #d9cbb3; padding-bottom:5px; margin-bottom:12px; }
  table { width:100%; border-collapse:collapse; margin-top:4px; }
  th { background:#2c271e; color:#f4efe6; font-size:8px; letter-spacing:1.5px; text-transform:uppercase; text-align:left; padding:9px 12px; font-weight:600; }
  th.r, td.r { text-align:right; }
  td { padding:11px 12px; border-bottom:1px solid #e3d9c7; font-size:11px; vertical-align:top; }
  tr.alt td { background:#ece4d4; }
  td .item { font-family:Georgia,serif; font-size:13px; }
  td .sub { font-size:8.5px; color:#8a7d68; }
  .total-col { font-weight:700; color:#2c271e; }
  .totals { margin-top:10px; margin-left:auto; width:46%; }
  .totals .row { display:flex; justify-content:space-between; padding:6px 12px; font-size:11px; border-bottom:1px solid #e3d9c7; }
  .totals .grand { background:#2c271e; color:#f4efe6; font-weight:700; border:0; border-radius:3px; margin-top:4px; padding:10px 12px; font-size:13px; }
  .highlight { background:#ece4d4; border-left:4px solid #9c5b2c; border-radius:0 4px 4px 0; padding:14px 18px; margin-top:18px; }
  .highlight h3 { margin:0 0 6px; font-size:14px; color:#2c271e; }
  .highlight p { margin:0; font-size:10px; color:#473826; line-height:1.6; }
  .badges { display:flex; gap:8px; margin-top:10px; flex-wrap:wrap; }
  .badge { background:#fff; border:1px solid #d9cbb3; color:#9c5b2c; font-size:8px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:4px 9px; border-radius:20px; }
  .badge.paid { background:#1f7a3d; border-color:#1f7a3d; color:#fff; }
  .bill { display:flex; gap:40px; flex-wrap:wrap; }
  .bill div b { display:block; font-size:8px; letter-spacing:1.5px; text-transform:uppercase; color:#9c5b2c; margin-bottom:3px; }
  .bill div span { font-size:12px; color:#2c271e; font-family:Georgia,serif; }
  .terms { display:flex; flex-wrap:wrap; gap:10px; margin-top:6px; }
  .term { width: calc(50% - 5px); background:#fff; border:1px solid #e3d9c7; border-radius:4px; padding:11px 14px; }
  .term b { display:block; font-size:8px; letter-spacing:1.5px; text-transform:uppercase; color:#9c5b2c; margin-bottom:3px; }
  .term span { font-size:10.5px; color:#2c271e; white-space:pre-wrap; }
  .footer { position:absolute; left:16mm; right:16mm; bottom:10mm; border-top:1px solid #d9cbb3; padding-top:8px; display:flex; justify-content:space-between; font-size:8.5px; color:#8a7d68; }
  .footer b { color:#9c5b2c; }
`;

export function DocumentSheet({ doc }: { doc: BizDoc }) {
  const showPrices = doc.type !== "delivery";
  const isPaid = doc.type === "receipt" || doc.status === "paid";
  const cur = doc.currency || "JD";

  const extra =
    doc.type === "quote"
      ? doc.validity && `Valid for: ${doc.validity}`
      : doc.type === "invoice"
        ? doc.dueDate && `Due: ${doc.dueDate}`
        : "";

  return (
    <div className="page">
      <div className="head">
        <div className="brand" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <PlexusMark size={42} />
          <div>
            Plexus
            <small>Workshop · Solid Wood, Amman</small>
          </div>
        </div>
        <div className="head-right">
          <b>{DOC_LABEL[doc.type]}</b>
          <br />
          Ref: {doc.number}
          <br />
          Date: {doc.date}
          {extra ? (
            <>
              <br />
              {extra}
            </>
          ) : null}
        </div>
      </div>

      <h1 className="doctitle">
        {DOC_LABEL[doc.type]} <span className="rule">—</span>{" "}
        {doc.clientName || "Client"}
      </h1>

      <div className="bill" style={{ marginTop: 14, marginBottom: 6 }}>
        <div>
          <b>Billed to</b>
          <span>{doc.clientName || "—"}</span>
        </div>
        {doc.clientPhone && (
          <div>
            <b>Contact</b>
            <span>{doc.clientPhone}</span>
          </div>
        )}
        {doc.clientNote && (
          <div>
            <b>Reference</b>
            <span>{doc.clientNote}</span>
          </div>
        )}
      </div>

      {/* line items */}
      <div className="sec">
        <div className="sec-title">
          {doc.type === "delivery" ? "Items delivered" : "Details"}
        </div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th className="r">Qty</th>
              {showPrices && <th className="r">Unit ({cur})</th>}
              {showPrices && <th className="r">Total ({cur})</th>}
            </tr>
          </thead>
          <tbody>
            {(doc.items || []).map((l, i) => (
              <tr key={l.id} className={i % 2 ? "alt" : undefined}>
                <td>
                  <span className="item">{l.desc || "—"}</span>
                  {l.sub && <div className="sub">{l.sub}</div>}
                </td>
                <td className="r">{l.qty}</td>
                {showPrices && <td className="r">{money(l.unit, cur)}</td>}
                {showPrices && (
                  <td className="r total-col">{money(lineTotal(l), cur)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {showPrices && (
          <div className="totals">
            <div className="row">
              <span>Subtotal</span>
              <span>{money(subtotal(doc), cur)}</span>
            </div>
            {doc.taxPct > 0 && (
              <div className="row">
                <span>Tax ({doc.taxPct}%)</span>
                <span>{money(taxAmount(doc), cur)}</span>
              </div>
            )}
            <div className="row grand">
              <span>{isPaid ? "Paid" : "Total"}</span>
              <span>{money(grandTotal(doc), cur)}</span>
            </div>
          </div>
        )}
      </div>

      {/* status / finish callout */}
      {(isPaid || doc.type === "quote") && (
        <div className="highlight">
          <h3>
            {isPaid
              ? "Payment received — thank you"
              : "This is a quotation, not an invoice"}
          </h3>
          <p>
            {isPaid
              ? "This document confirms payment in full for the items above."
              : `Prices are valid ${doc.validity || "for 30 days"}.${doc.leadTime ? ` Estimated lead time: ${doc.leadTime}.` : ""} Production begins after confirmation.`}
          </p>
          <div className="badges">
            {isPaid && <span className="badge paid">Paid</span>}
            {doc.leadTime && doc.type === "quote" && (
              <span className="badge">Lead time: {doc.leadTime}</span>
            )}
          </div>
        </div>
      )}

      {/* terms / notes */}
      {(doc.terms || doc.notes || doc.dueDate) && (
        <div className="sec">
          <div className="sec-title">
            {doc.type === "invoice" ? "Payment & terms" : "Terms & notes"}
          </div>
          <div className="terms">
            {doc.dueDate && doc.type === "invoice" && (
              <div className="term">
                <b>Payment due</b>
                <span>{doc.dueDate}</span>
              </div>
            )}
            {doc.terms && (
              <div className="term">
                <b>Terms</b>
                <span>{doc.terms}</span>
              </div>
            )}
            {doc.notes && (
              <div className="term">
                <b>Notes</b>
                <span>{doc.notes}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="footer">
        <div>
          www.plexusworkshop.com &nbsp;·&nbsp; Instagram <b>@plexus.workshop</b>
        </div>
        <div>
          Amman, Jordan &nbsp;·&nbsp; <b>+962 79 179 2129</b>
        </div>
      </div>
    </div>
  );
}

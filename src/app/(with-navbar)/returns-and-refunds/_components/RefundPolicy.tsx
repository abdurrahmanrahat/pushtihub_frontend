const RefundPolicy = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        Refund Policy
      </h2>

      <div className="space-y-3 text-muted-foreground text-justify px-2">
        <p>
          <strong className="text-foreground">Processing Time:</strong> Once we
          receive your returned item, we&apos;ll inspect it and notify you of
          the approval or rejection of your refund. If approved, your refund
          will be processed within 5-7 business days to your original payment
          method.
        </p>
        <p>
          <strong className="text-foreground">Partial Refunds:</strong> We may
          grant partial refunds for items that are returned not in their
          original condition, damaged, or with missing parts for reasons not due
          to our error.
        </p>
        <p>
          <strong className="text-foreground">Shipping Costs:</strong> Original
          shipping fees are non-refundable except in cases where we sent the
          wrong item or the item arrived defective or damaged. Return shipping
          costs are the customer&apos;s responsibility unless the return is due
          to our error.
        </p>
        <p>
          <strong className="text-foreground">Exchanges:</strong> We only
          replace items if they are defective or damaged. If you need to
          exchange an item for the same product, contact us at
          support@gadgetoria.com.
        </p>
      </div>
    </section>
  );
};

export default RefundPolicy;

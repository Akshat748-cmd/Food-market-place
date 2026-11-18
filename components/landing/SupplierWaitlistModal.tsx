'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Store } from 'lucide-react';
import { GroceryBagIllustration } from '@/components/illustrations';

export interface SupplierWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupplierWaitlistModal({ isOpen, onClose }: SupplierWaitlistModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('delhi-ncr');
  const [category, setCategory] = useState('Dairy & Paneer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={submitted ? 'Application Received!' : 'Join Verified Supplier Network'}
      description={
        submitted
          ? 'Our mandi verification team will contact your business within 24 hours.'
          : 'Supply verified restaurants, cafes, and cloud kitchens in your city with guaranteed volumes.'
      }
    >
      {submitted ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#EAF3ED] text-[#315B42] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-[#2C1E14]">Welcome aboard, {name || 'Partner'}!</h4>
            <p className="text-xs text-[#8A7662] max-w-sm mx-auto">
              We have listed your interest for <strong>{category}</strong> in <strong>{city}</strong>. We look forward to connecting you with local kitchens.
            </p>
          </div>
          <Button variant="primary" size="md" fullWidth onClick={handleReset}>
            Close & Back to Hub
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="Business / Contact Name"
            required
            placeholder="e.g. Ramesh Agro Mandi Traders"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Phone Number (WhatsApp Active)"
            required
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="City Mandi Hub"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              options={[
                { label: 'Delhi NCR (Azadpur / Ghazipur)', value: 'delhi-ncr' },
                { label: 'Mumbai (Vashi APMC)', value: 'mumbai' },
                { label: 'Bengaluru (Yeshwanthpur)', value: 'bengaluru' },
                { label: 'Hyderabad (Bowenpally)', value: 'hyderabad' },
                { label: 'Chennai (Koyambedu)', value: 'chennai' },
                { label: 'Kolkata (Posta Bazar)', value: 'kolkata' },
                { label: 'Pune (Gultekdi)', value: 'pune' },
                { label: 'Ahmedabad (Jamalpur)', value: 'ahmedabad' },
              ]}
            />

            <Select
              label="What You Supply"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { label: 'Dairy, Paneer & Butter', value: 'Dairy & Paneer' },
                { label: 'Poultry, Eggs & Meats', value: 'Poultry & Meat' },
                { label: 'Vegetables & Fresh Produce', value: 'Vegetables' },
                { label: 'Grains, Atta & Pulses', value: 'Grains & Pulses' },
                { label: 'Bulk Spices & Dry Fruits', value: 'Spices' },
                { label: 'Cooking Oils & Ghee', value: 'Oils & Ghee' },
                { label: 'Packaging & Disposables', value: 'Packaging' },
              ]}
            />
          </div>

          <div className="pt-2">
            <Button variant="primary" size="lg" fullWidth type="submit">
              Submit Supplier Application &rarr;
            </Button>
            <p className="text-center text-[11px] text-[#8A7662] mt-2">
              Requires valid FSSAI / Trade License &bull; Zero listing fees
            </p>
          </div>
        </form>
      )}
    </Modal>
  );
}

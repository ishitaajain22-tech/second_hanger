/** Seller Trust Score (0-100): verification 20 + ratings 30 + response 20 + successful sales 30 - disputes */
export function trustScore(s) {
  const ver = (s.verified.id ? 12 : 0) + (s.verified.phone ? 5 : 0) + (s.verified.email ? 3 : 0);
  const rating = Math.round((Math.max(0, s.rating - 3) / 2) * 30);
  const resp = s.respHrs <= 1 ? 20 : s.respHrs <= 3 ? 16 : s.respHrs <= 6 ? 11 : s.respHrs <= 12 ? 6 : 2;
  const tx = Math.min(30, Math.round((Math.log10(1 + s.sales) / Math.log10(250)) * 30));
  const total = Math.max(0, Math.min(100, ver + rating + resp + tx - (s.disputes || 0) * 4));
  const badges = [];
  if (s.verified.id) badges.push('ID verified');
  if (s.respHrs <= 2) badges.push('Quick responder');
  if (s.sales >= 100) badges.push('Top seller');
  if (!s.disputes && s.sales >= 20) badges.push('Zero disputes');
  return {
    total,
    label: total >= 90 ? 'Excellent' : total >= 75 ? 'Trusted' : total >= 60 ? 'Good' : 'Building trust',
    color: total >= 90 ? '#1F7A4D' : total >= 75 ? '#4F8A2B' : total >= 60 ? '#B58A1B' : '#B5573A',
    parts: [
      { key: 'Verification', val: ver, max: 20 },
      { key: 'Ratings', val: rating, max: 30 },
      { key: 'Response time', val: resp, max: 20 },
      { key: 'Successful sales', val: tx, max: 30 },
    ],
    badges,
  };
}
export const respLabel = (h) => (h < 1 ? 'under 1 hour' : h <= 1.5 ? '~1 hour' : `~${Math.round(h)} hours`);

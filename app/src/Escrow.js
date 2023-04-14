import { useEffect, useState } from 'react';

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
}) {
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    // Check if the approval status is saved in local storage
    const savedApproval = localStorage.getItem(address);

    if (savedApproval !== null) {
      setApproved(JSON.parse(savedApproval));
    }
  }, [address]);

  async function handleClick() {
    await handleApprove();

    // Save the approval status to local storage
    localStorage.setItem(address, JSON.stringify(true));
    setApproved(true);
  }

  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} ETH </div>
        </li>
        <div
          className={`button ${approved ? 'complete' : ''}`}
          id={address}
          onClick={(e) => {
            e.preventDefault();
            handleClick();
          }}
        >
          {approved ? "✓ It's been approved!" : 'Approve'}
        </div>
      </ul>
    </div>
  );
}

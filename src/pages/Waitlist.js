import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import Header from "../components/Header";
import Button from "../components/Button";
import Logo from "../images/logo.svg";
import WalletLogo from "../images/wallet.png";
import TelegramLogo from "../images/telegram.png";
import XLogo from "../images/x.png";
import CopyIcon from "../images/copy.webp";
import { toast } from "react-toastify";
const stepsEnum = {
  CODE: "CODE",
  JOIN_FAST_TRACK: "JOIN_FAST_TRACK",
  WELCOME: "WELCOME",
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'
const Waitlist = () => {
  const [currentStep, setCurrentStep] = useState(stepsEnum.CODE);

  const [otp, setOtp] = useState("");
  const [referral_code, setReferralCode] = useState('');

  const onOtpChange = (e) => {
    // Allow only numbers
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    // Max length of OTP is 6
    if (value.length <= 6) {
      setOtp(value);
    } else if (value.length === 0) {
      setOtp(value);
    }
  };
  const handleVerifyCode = async () => {
    if ((otp.length === 6) || (otp.toUpperCase() === 'CASH')) {
      const res = await fetch(`${API_BASE_URL}/api/verify-referral-code`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referred_by: otp.toUpperCase(),
        }),
      });
      const data = res.json();
      if (res.ok){
        toast.success("Referral code is " + data.message);
        setCurrentStep(stepsEnum.JOIN_FAST_TRACK);
      }
      else{
        toast.error(data.error);
      }
    }
    else{
      toast.error("Invalid Referral Code");
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case stepsEnum.CODE:
        return (
          <CodeContent
            otp={otp}
            onOtpChange={onOtpChange}
            handleVerifyCode={handleVerifyCode}
          />
        );
      case stepsEnum.JOIN_FAST_TRACK:
        return <JoinFastTrackContent setCurrentStep={setCurrentStep} otp = {otp} setReferralCode = {setReferralCode} />;
      case stepsEnum.WELCOME:
        return <WelcomeContent otp = {otp} referral_code={referral_code} />;
      default:
        return (
          <CodeContent
            otp={otp}
            onOtpChange={onOtpChange}
            handleVerifyCode={handleVerifyCode}
          />
        );
    }
  };

  return (
    <div className="w-full h-full bg-[url('./images/background.jpeg')] bg-blend-overlay flex flex-col bg-no-rep bg-cover justify-between">
      <div>
        <Header />
        <div className="flex flex-col items-center justify-center text-white px-4 mt-[2%]">
          <div className="mb-[5%] lg:mb-0">
            <img src={Logo} alt="Logo" className="h-24" />
          </div>
          <div className="p-[2px] rounded-xl bg-gradient-to-b from-transparent from-35% to-primaryGreen">
            <div className="max-w-full w-[90vw] lg:w-[512px] rounded-xl bg-gradient-to-br from-[#0f3c49] from-5% to-40% to-[#031521] shadow-lg shadow-green-500/50 px-4 lg:px-8 py-8 text-center">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[#eeecda] text-sm mb-4">
          Fuck the rules. Let’s do cool shit.
        </p>
      </div>
    </div>
  );
};

const CodeContent = ({ otp, onOtpChange, handleVerifyCode }) => {
  return (
    <div>
      <h2 className="text-3xl lg:text-4xl font-semibold my-2 text-[#eeecda]">
        Coming Soon
      </h2>
      <p className="text-[#eeecda] text-sm mb-8">
        Fuck the rules. Let’s do cool shit.
      </p>

      {/* Code Input */}
      <div className="mb-4">
        <label
          htmlFor="code"
          className="block text-sm text-green-500 mb-1 opacity-70"
        >
          Got a code? Prove you belong.
        </label>
        <div className="lg:mx-8">
          <div className="border-[#1d4a12] border bg-[#02140f] rounded-full  inline-flex justify-center items-center w-full">
            <input
              className="bg-transparent border-transparent px-4 lg:px-6 py-4 w-full text-center outline-none tracking-[0.75em] text-3xl text-green-600 font-semibold placeholder:text-green-600"
              placeholder="######"
              value={otp}
              onChange={onOtpChange}
            />
          </div>
        </div>
      </div>

      {/* Verify Button */}
      <div className="lg:px-8">
        <Button
          title="Verify Code"
          onClick={handleVerifyCode}
          isFullWidth={true}
        />
      </div>

      {/* Footer Text */}
      <p className="mt-8 text-primaryGreen opacity-50 text-sm">
        Dont have a code? Better get one fast.
      </p>
    </div>
  );
};

const JoinFastTrackContent = ({ setCurrentStep, otp, setReferralCode }) => {
  const {connected, disconnect, publicKey} = useWallet();
  const [buttonStates, setButtonStates] = useState({
    connectWallet: "Connect Wallet",
    followX: "Follow Us on X",
    joinTelegram: "Join Telegram",
  });
  const { setVisible } = useWalletModal();
  const truncatePublicKey = (key) => {
    if (!key) return "Connect Wallet";
    return `${key.toString().slice(0, 6)}...`; // Truncate the public key to first 6 characters
  };
  const items = [
    {
      icon: WalletLogo,
      title: connected ? truncatePublicKey(publicKey) : "Connect Wallet",
      onClick:async ()=>{
        if (connected) {
          disconnect();
        }
        else{
          setVisible(true);
        }
        setButtonStates((prevState) => ({
          ...prevState,
          connectWallet: "Disconnect",
        }));
      },
    },
    {
      icon: XLogo,
      title: buttonStates.followX,
      onClick: ()=>{
        window.open("", "_blank");
        setTimeout(() => {
          setButtonStates((prevState) => ({
            ...prevState,
            followX: "Followed",
          }));
        }, 2000);
      },
    },
    {
      icon: TelegramLogo,
      title: buttonStates.joinTelegram,
      onClick: ()=>{
        window.open("", "_blank");
        setTimeout(() => {
          setButtonStates((prevState) => ({
            ...prevState,
            joinTelegram: "Joined",
          }));
        }, 2000);
      },
    },
  ];

  const joinFastTrack = async (wallet_address, referred_by, joinedTG, followedX) => {
    // Call API to join fast track
    
    if (!(followedX && joinedTG) || !wallet_address){ 
      toast.error("Please complete all tasks before proceeding") 
      return;
    }
    try{
      const res = await fetch(`${API_BASE_URL}/api/verify-wallet`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: wallet_address,
          referred_by: referred_by,
        }),
      });
      const data = await res.json();
      if (res.ok){
        setReferralCode(data.referral_code);
        setCurrentStep(stepsEnum.WELCOME);
      }
      else {
        toast.error(data.error);
        return;
      }
    }
    catch(error){
      console.error("Verification Error:", error);
    }
    // If success, set current step to welcome
    
  };
  return (
    <div>
      <h2 className="text-3xl lg:text-4xl font-semibold my-2 text-[#eeecda]">
        You're Almost In
      </h2>
      <p className="text-[#eeecda] text-sm mb-8">
        Do the tasks to unlock Fast Track Access
      </p>
      <div className="my-4 flex flex-col justify-center items-center">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 mb-6">
            <img src={item.icon} alt={item.title} className="w-12 mr-4" />
            <Button variant="secondary" title={item.title} onClick={item.onClick}/>
          </div>
        ))}
      </div>
      <div className="mb-2 lg:px-8">
        <Button
          title="Verify and Join Fast Track"
          isFullWidth={true}
          onClick={() => 
            joinFastTrack(
              publicKey, 
              otp, 
              buttonStates.followX === "Followed", 
              buttonStates.joinTelegram === "Joined"
            )
          }
        />
      </div>
    </div>
  );
};

const WelcomeContent = ({otp, referral_code}) => {
  const referralLink = `https://brand.com/?ref=${referral_code}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard");
  };
  return (
    <div>
      <h2 className="text-3xl lg:text-4xl font-semibold my-2 text-[#eeecda]">
        Welcome to Fast Track
      </h2>
      <p className="text-[#eeecda] text-sm mb-8">
        Do the tasks to unlock Fast Track Access
      </p>

      <h3 className="text-base text-primaryGreen mb-1">
        Get Paid, Refer Your Friend
      </h3>
      <p className="text-[#eeecda] text-sm mb-8">
        Share your code and bring them into the Fast Track
      </p>

      <h3 className="text-base text-primaryGreen mb-1 opacity-50">
        Your Referral Link
      </h3>
      <div className="border-[#1d4a12] border bg-[#02140f] rounded-full px-4 lg:px-6 py-4 inline-flex justify-center items-center">
        <div className="text-base lg:text-base text-primaryGreen font-medium inline-block">
          {referralLink}
        </div>
        <div
          className="inline-flex ml-2 lg:ml-4 px-3 py-1 bg-[#eeecda] rounded-full text-black text-sm font-semibold items-center justify-center cursor-pointer"
          onClick={copyToClipboard}
        >
          <span>
            <img src={CopyIcon} alt="copy icon" className="h-3 lg:h-4" />
          </span>
          <span className="hidden lg:inline ml-1">Copy</span>
        </div>
      </div>
      <p className="text-[#eeecda] text-sm mt-4">
        You'll collect{" "}
        <span className="text-primaryGreen font-medium">80% of the fees</span>{" "}
        from everyone who joins with your code
      </p>
    </div>
  );
};

export default Waitlist;

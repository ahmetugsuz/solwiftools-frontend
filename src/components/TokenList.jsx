import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Keep this in case backend is reactivated later
import '../styles/TokenList.css';
import { toast } from 'react-hot-toast';
import KlikkFixLogo from '../images/KF128x128.png';

const TokenList = ({ walletAddress }) => {
    const [tokens, setTokens] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        
        fetchTokens();
        
    }, [walletAddress]);

    const fetchTokens = async () => {
        setIsLoading(true);
        setTimeout(() => {
        try {
            // ❌ Temporarily disabled backend fetching
            // const response = await axios.get(`/api/tokens/list/${walletAddress}`);
            // const fetchedTokens = response.data.tokens || [];

            // 🔹 Local placeholder list (no backend)
            const fetchedTokens = []; // Simulating empty backend result

            if (fetchedTokens.length === 0) {
                console.log("No tokens found, using defaults");
                setTokens([
                    {
                        name: "KlikkFix Token",
                        symbol: "KFX",
                        tokenMintAddress: "n2i3oh4io23hmewikfjeiowf23oi4h23oi4h23oi",
                        supply: 1,
                        decimals: 0,
                        paymentStatus: "completed",
                        webkitURL: "klikkfix.com",
                        revokeAuthorities: {
                            mint: true,
                            freeze: false,
                            update: false
                        },
                        image: KlikkFixLogo
                        
                    },
                    {
                        name: "Demo Token",
                        symbol: "DEMO",
                        tokenMintAddress: "DEMO1234567890",
                        supply: 1000,
                        decimals: 2,
                        paymentStatus: "completed",
                        revokeAuthorities: {
                            mint: false,
                            freeze: true,
                            update: true
                        },
                        
                    }
                ]);
            } else {
                setTokens(fetchedTokens);
            }
        } catch (error) {
            console.error('Error fetching tokens:', error);
            // Fallback to default if any error happens
            setTokens([
                {
                    name: "KlikkFix License",
                    symbol: "KFX",
                    tokenMintAddress: "DEFAULTLICENSE123",
                    supply: 1,
                    decimals: 0,
                    paymentStatus: "completed",
                    revokeAuthorities: {
                        mint: false,
                        freeze: false,
                        update: false
                    },
                    
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    }, 1000); // Simulate network delay
    };

    // ❌ Disable backend actions for now — only log locally
    const handleMintMore = async (tokenMint, amount) => {
        console.log(`Mint More clicked for ${tokenMint}, +${amount}`);
        toast.success(`Simulated minting ${amount} more of ${tokenMint}`);
        // fetchTokens(); // Optional: reload defaults
    };

    const handleFreeze = async (tokenMint) => {
        console.log(`Freeze clicked for ${tokenMint}`);
        toast.success(`Simulated freezing of ${tokenMint}`);
        // fetchTokens();
    };

    const handleDeleteToken = async (tokenMintAddress) => {
        console.log(`Delete clicked for ${tokenMintAddress}`);
        // ❌ Disabled backend delete
        // await axios.delete(`/api/tokens/${tokenMintAddress}`);
        setTokens(tokens.filter(token => token.tokenMintAddress !== tokenMintAddress));
        toast.success('Token removed from list');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="token-list">
            <div className="token-list-header">
                <h2 className="text-2xl font-bold">Your Tokens</h2>
                <button
                    onClick={fetchTokens}
                    className="refresh-button"
                    title="Refresh token list"
                >
                    <span className="refresh-icon">↻</span>
                </button>
            </div>

            {tokens.filter(token => token.paymentStatus === 'completed').length === 0 ? (
                <p className="text-gray-500">No tokens found. Create one to get started!</p>
            ) : (
                <div className="token-grid">
                    {tokens
                        .filter(token => token.paymentStatus === 'completed')
                        .map((token) => (
                        <div key={token.tokenMintAddress} className="token-card">
                            <div className="token-card-header">
                                <button 
                                    onClick={() => handleDeleteToken(token.tokenMintAddress)}
                                    className="token-close-button"
                                    title="Remove from list"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="token-card-content">
                                <div className="token-card-left">
                                    <div>
                                        <h3 className="font-bold">{token.name}</h3>
                                        <p className="text-sm text-gray-600">{token.symbol}</p>
                                    </div>

                                    <div className="text-sm mb-3">
                                        <p className="text-gray-600">Supply: {token.supply}</p>
                                        <p className="text-gray-600">Decimals: {token.decimals}</p>
                                        <p className="text-gray-600">
                                            Mint: {token.tokenMintAddress.slice(0, 20)}...
                                        </p>
                                    </div>

                                    <div className="token-buttons">
                                        <button
                                            onClick={() => handleMintMore(token.tokenMintAddress, 1000)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                            disabled={token.isFrozen}
                                        >
                                            Mint More
                                        </button>

                                        {/* Add-on boxes */}
                                        <div className="addon-boxes">
                                            <div 
                                                className={`addon-box ${token.revokeAuthorities?.mint ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                                            >
                                                Mint
                                            </div>
                                            <button
                                                className={`addon-box ${token.revokeAuthorities?.freeze ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                                                disabled={token.revokeAuthorities?.freeze}
                                                onClick={() => handleFreeze(token.tokenMintAddress)}
                                            >
                                                Freeze
                                            </button>
                                            <button
                                                className={`addon-box ${token.revokeAuthorities?.update ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                                                disabled={token.revokeAuthorities?.update}
                                            >
                                                Update
                                            </button>
                                        </div>

                                        <a
                                            href={`https://explorer.solana.com/address/${token.tokenMintAddress}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700 text-sm"
                                        >
                                            View ↗
                                        </a>
                                    </div>
                                </div>
                                <div className="token-card-right">
                                    {token.image ? (
                                        <img 
                                            src={token.image}
                                            alt={`${token.name} logo`}
                                            className="token-logo"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/default-token.png';
                                            }}
                                        />
                                    ) : (
                                        <div className="token-logo-placeholder">
                                            {token.symbol.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TokenList;

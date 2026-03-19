import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const PipelineRunnerPopup = () => {
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region') || 'US';
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('initializing'); // initializing, running, completed, error
  const scrollRef = useRef(null);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const sseUrl = `${backendUrl}/pipeline/stream?region=${region}`;
    
    setStatus('running');
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      setLogs((prev) => [...prev, event.data]);
    };

    eventSource.addEventListener('close', (event) => {
      setLogs((prev) => [...prev, `\n[FINISH] ${event.data}`]);
      setStatus('completed');
      eventSource.close();
    });

    eventSource.onerror = (err) => {
      console.error('SSE Error:', err);
      // Don't set error status immediately if it's just a disconnect at the end
      if (status !== 'completed') {
        setLogs((prev) => [...prev, '\n[ERROR] Connection lost or server error.']);
        setStatus('error');
      }
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [region]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="terminal-title">LeadGen Pipeline: {region}</div>
        <div className={`status-pill ${status}`}>
          {status.toUpperCase()}
        </div>
      </div>
      
      <div className="terminal-body" ref={scrollRef}>
        <div className="scanline"></div>
        <div className="log-line intro">
          <span className="prompt">root@leadgen:~#</span> ./run_pipeline.sh --region={region}
        </div>
        <div className="log-line">
          [SYSTEM] Initializing stream from {import.meta.env.VITE_API_BASE_URL}...
        </div>
        
        {logs.map((log, i) => (
          <div key={i} className="log-line">
            {log}
          </div>
        ))}
        
        {status === 'running' && (
          <div className="log-line cursor-line">
            <span className="cursor">_</span>
          </div>
        )}
        
        {status === 'completed' && (
          <div className="log-line success">
            <span className="prompt">root@leadgen:~#</span> Execution finished. 
            <button className="close-btn" onClick={() => window.close()}>CLOSE WINDOW</button>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        body { margin: 0; background: #000; overflow: hidden; }
        .terminal-container {
          height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          background: #0a0a0a;
          color: #00ff41; /* Classic Matrix/Hacker green */
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 14px;
          border: 1px solid #333;
        }

        .terminal-header {
          background: #1a1a1a;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #333;
          user-select: none;
        }

        .terminal-dots { display: flex; gap: 8px; margin-right: 20px; }
        .dot { width: 12px; height: 12px; border-radius: 50%; }
        .dot.red { background: #ff5f56; }
        .dot.yellow { background: #ffbd2e; }
        .dot.green { background: #27c93f; }

        .terminal-title {
          flex: 1;
          text-align: center;
          color: #888;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .status-pill {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: bold;
        }
        .status-pill.running { background: #004d1a; color: #00ff41; }
        .status-pill.completed { background: #003366; color: #00d4ff; }
        .status-pill.error { background: #4d0000; color: #ff4d4d; }

        .terminal-body {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          position: relative;
          background: radial-gradient(circle at center, #0d0d0d 0%, #000000 100%);
        }

        /* Subtle scanline effect */
        .scanline {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.25) 50%
          );
          background-size: 100% 4px;
          z-index: 10;
          pointer-events: none;
        }

        .log-line {
          line-height: 1.6;
          margin-bottom: 4px;
          word-break: break-all;
          text-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
        }

        .prompt { color: #00d4ff; margin-right: 10px; }
        .intro { color: #fff; margin-bottom: 15px; border-bottom: 1px dashed #333; padding-bottom: 10px; }
        
        .cursor {
          display: inline-block;
          width: 8px;
          height: 15px;
          background: #00ff41;
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }

        .success { color: #00d4ff; margin-top: 20px; border-top: 1px solid #333; padding-top: 10px; }
        
        .close-btn {
          background: #00ff41;
          color: #000;
          border: none;
          padding: 6px 12px;
          font-family: inherit;
          font-weight: bold;
          cursor: pointer;
          margin-left: 20px;
          border-radius: 2px;
        }
        .close-btn:hover { background: #fff; }

        /* Scrollbar */
        .terminal-body::-webkit-scrollbar { width: 8px; }
        .terminal-body::-webkit-scrollbar-track { background: #000; }
        .terminal-body::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .terminal-body::-webkit-scrollbar-thumb:hover { background: #444; }
      `}} />
    </div>
  );
};

export default PipelineRunnerPopup;

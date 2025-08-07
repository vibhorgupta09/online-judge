import React from 'react';
import { Modal, Box, Typography, Divider } from '@mui/material';

const ReusableModal = ({ open, handleClose, modalType, modalData }) => {
  const renderContent = () => {
    switch (modalType) {
        case 'solved':
        return (
            <>
            <Typography variant="h6">Problems Solved</Typography>
            <Divider sx={{ my: 1 }} />
            {modalData?.length ? (
                modalData.map((problem, idx) => (
                <p key={idx}>
                    {problem.title} — <strong>{problem.difficulty}</strong>
                </p>
                ))
            ) : (
                <p>No problems solved yet.</p>
            )}
            </>
        );

        case 'created':
        return (
            <>
            <Typography variant="h6">Problems Created</Typography>
            <Divider sx={{ my: 1 }} />
            {modalData?.length ? (
                modalData.map((problem, idx) => (
                <p key={idx}>
                    {problem.title} — <strong>{problem.difficulty}</strong>
                </p>
                ))
            ) : (
                <p>No problems created yet.</p>
            )}
            </>
        );

        case 'submissions':
        return (
            <>
            <Typography variant="h6">Submission History</Typography>
            <Divider sx={{ my: 1 }} />
            {modalData?.length ? (
                modalData.map((sub, idx) => (
                <p key={idx}>
                    {sub.problemId?.title || "Unknown Problem"} — {sub.verdict} —{" "}
                    {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : "Unknown Date"}
                </p>
                ))
            ) : (
                <p>No submissions yet.</p>
            )}
            </>
        );

        case 'view-code':
        // return (
        //     <>
        //     <Typography variant="h6">Submitted Code</Typography>
        //     <Divider sx={{ my: 1 }} />
        //     <pre 
        //     style={{
        //     backgroundColor: '#f5f5f5',
        //     padding: '10px',
        //     borderRadius: '5px',
        //     overflowX: 'auto',
        //     whiteSpace: 'pre-wrap',
        //     wordBreak: 'break-word',
        //     maxHeight: '60vh',
        //     fontSize: '14px',
        //     color: '#333',
        //     }}>
        //         {modalData|| 'No code available.'}
        //     </pre>
        //     </>
        // );
        return (
            <>
            <Typography variant="h6">Submitted Code</Typography>
            <Divider sx={{ my: 1 }} />
            <Box
                component="pre"
                sx={{
                backgroundColor: '#f5f5f5',
                padding: 2,
                borderRadius: 1,
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '60vh',
                fontSize: '14px',
                color: '#333',
                }}
            >
                {modalData || 'No code available.'}
            </Box>
            </>
        );

        default:
        return <Typography>No content available</Typography>;
    }
    };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxHeight: '80vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          overflowY: 'auto',
          borderRadius: 2,
          backdropFilter: 'blur(6px)'
        }}
      >
        {renderContent()}
      </Box>
    </Modal>
  );
};

export default ReusableModal;
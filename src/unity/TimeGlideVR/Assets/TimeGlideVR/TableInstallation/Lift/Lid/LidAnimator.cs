using System.Collections;
using UnityEngine;

namespace TimeGlideVR.TableInstallation.Lift.Lid
{
    public class LidAnimator : MonoBehaviour
    {
        public LidState State { get; set; }

        private float _closedPositionZ;
        private float _openPositionZ;
        private float _currentPositionZ;
        
        private float _closedScaleZ;
        private float _openScaleZ;
        
        
        [SerializeField]
        private float speed = 1.0f;
        
        public void Awake()
        {
            var currentPosition = transform.localPosition;
            var currenScale = transform.localScale;
            _closedScaleZ = currenScale.z;
            _openScaleZ = 0.02f;
            _closedPositionZ = currentPosition.z;
            _openPositionZ = _closedPositionZ + (_closedScaleZ - _openScaleZ) * 5 ;
            _currentPositionZ = _closedPositionZ;
            State = LidState.Closed;
        }

        public void Update()
        {
            AnimateLid();
        }

        private void AnimateLid()
        {
            if(State is LidState.Closed or LidState.Open) return;
            
            if (State is LidState.Opening)
            {
                _currentPositionZ += Time.deltaTime * speed;
                if (_currentPositionZ >= _openPositionZ)
                {
                    _currentPositionZ = _openPositionZ;
                    State = LidState.Open;
                }
            }
            else if (State is LidState.Closing)
            {
                _currentPositionZ -= Time.deltaTime * speed;
                if (_currentPositionZ <= _closedPositionZ)
                {
                    _currentPositionZ = _closedPositionZ;
                    State = LidState.Closed;
                }
            }
            SetLidPosition();
        }

        
        public void Open()
        {
            State = LidState.Opening;
            SetLidPosition();
        }
        
        public void Close()
        {
            State = LidState.Closing;
            SetLidPosition();
        }

        private void SetLidPosition()
        {
            transform.localPosition = new Vector3(transform.localPosition.x, transform.localPosition.y, _currentPositionZ);
            var openPercentage = (_currentPositionZ - _closedPositionZ) / (_openPositionZ - _closedPositionZ);
            var currentScale = _closedScaleZ - (_closedScaleZ - _openScaleZ) * openPercentage;
            transform.localScale = new Vector3(transform.localScale.x, transform.localScale.y, currentScale);
        }
    }
}
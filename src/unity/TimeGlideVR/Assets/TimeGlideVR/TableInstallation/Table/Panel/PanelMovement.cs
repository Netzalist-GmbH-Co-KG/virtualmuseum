using System;
using UnityEngine;

namespace TimeGlideVR.TableInstallation.Table.Panel
{
    public class PanelMovement : MonoBehaviour
    {
        [SerializeField] private float panelYExtended = 0.2f;
        [SerializeField] private float panelYRetracted = -0.07f;
        [SerializeField] private float panelZExtended = 0.377f;
        [SerializeField] private float panelZRetracted = 0f;
        [SerializeField] Transform panelTransform;
        [SerializeField] float panelSpeed = 0.15f;
    
        private bool _isExtended = false;
        private bool _isMoving = false;
    
        public void Extend()
        {
            _isExtended = true;
            _isMoving = true;
        }
    
        public void Retract()
        {
            _isExtended = false;
            _isMoving = true;
        }

        void Update()
        {
            if (!_isMoving)
                return;

            if (_isExtended)
            {
                if (panelTransform.localPosition.z < panelZExtended)
                {
                    panelTransform.localPosition += new Vector3(0, 0, panelSpeed * Time.deltaTime);
                }
                else if (panelTransform.localPosition.z > panelZExtended)
                {
                    panelTransform.localPosition =
                        new Vector3(panelTransform.localPosition.x, panelTransform.localPosition.y, panelZExtended);
                }

                if (Math.Abs(panelTransform.localPosition.z - panelZExtended) < 0.01f)
                {
                    if (panelTransform.localPosition.y < panelYExtended)
                    {
                        panelTransform.localPosition += new Vector3(0, panelSpeed * Time.deltaTime, 0);
                    }
                    else if (panelTransform.localPosition.y > panelYExtended)
                    {
                        panelTransform.localPosition = new Vector3(panelTransform.localPosition.x, panelYExtended, panelTransform.localPosition.z);
                        _isMoving = false;
                    }
                }
            }
            else
            {
                if (panelTransform.localPosition.z > panelZRetracted)
                {
                    panelTransform.localPosition -= new Vector3(0, 0, panelSpeed * Time.deltaTime * 6);
                }
                else if (panelTransform.localPosition.z < panelZRetracted)
                {
                    panelTransform.localPosition =
                        new Vector3(panelTransform.localPosition.x, panelTransform.localPosition.y, panelZRetracted);
                    _isMoving = false;
                }

                if (panelTransform.localPosition.y > panelYRetracted)
                {
                    panelTransform.localPosition -= new Vector3(0, panelSpeed * Time.deltaTime * 10, 0);
                }
                else if (panelTransform.localPosition.y < panelYRetracted)
                {
                    panelTransform.localPosition = new Vector3(panelTransform.localPosition.x, panelYRetracted,
                        panelTransform.localPosition.z);

                }
            }
        }
    }
}

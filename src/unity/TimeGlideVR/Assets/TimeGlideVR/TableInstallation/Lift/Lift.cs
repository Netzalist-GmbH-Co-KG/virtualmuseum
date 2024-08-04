using System.Collections;
using TimeGlideVR.TableInstallation.Lift.Lid;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.Serialization;

namespace TimeGlideVR.TableInstallation.Lift
{
    public enum LiftState
    {
        GoingUp,
        GoingDown,
        Top,
        Bottom
    }
    
    public class Lift : MonoBehaviour
    {
        [SerializeField] 
        public UnityEvent onLiftDescending;

        [SerializeField] 
        public UnityEvent onLiftAscending;

        [SerializeField] 
        public UnityEvent onLiftTop;

        [SerializeField] 
        public UnityEvent onLiftBottom;
        
        [SerializeField] 
        private LidAnimator lidAnimator;
       
        [SerializeField]
        private Transform floorTransform;

        [SerializeField]
        private Transform boxTransform;

        [SerializeField]
        private Transform liftedObjectTransform;

        [SerializeField]
        private float floorPositionYDown = -1.3f;

        [SerializeField]
        private float floorPositionYUp = -0.86f;

        [SerializeField]
        private float liftSpeed = 1.0f;
        
        [FormerlySerializedAs("liftMoveSound")] [SerializeField]
        private AudioSource lidOpenCloseSound;

        [SerializeField]
        private AudioSource liftMovingSound;
        
        private LiftState _liftState = LiftState.Bottom;
        
        private float _liftedTransformBaseY;

        public void Awake()
        {
            if(liftedObjectTransform !=null)
                _liftedTransformBaseY = liftedObjectTransform.localPosition.y;
        }

        // public void Start()
        // {
        //     ToggleLift();
        //     // StartCoroutine(nameof(ToggleTest));
        // }

        private IEnumerator ToggleTest()
        {
            while (true)
            {
                yield return new WaitForSeconds(10);
                ToggleLift();
            }
        }

        public void Update()
        {
            if(_liftState == LiftState.GoingDown || _liftState == LiftState.GoingUp  )
            {
                AnimateLift();
            }
            else
            {
                StopPlayingLiftMoving();
            }

            if (_liftState == LiftState.Bottom && lidAnimator.State == LidState.Closed && (liftedObjectTransform.gameObject.activeSelf || boxTransform.gameObject.activeSelf || floorTransform.gameObject.activeSelf))
            {
                boxTransform.gameObject.SetActive(false);
                liftedObjectTransform.gameObject.SetActive(false);
                floorTransform.gameObject.SetActive(false);
            }

            if (_liftState == LiftState.Top)
            {
                boxTransform.gameObject.SetActive(false);
            }
        }

        private void AnimateLift()
        {
            if (lidAnimator.State == LidState.Opening) return;
            if (lidAnimator.State != LidState.Open)
            {
                PlayLidOpenClosing();
                lidAnimator.Open();
                return;
            }
            PlayLiftMoving();
            var targetY = _liftState == LiftState.GoingUp ? floorPositionYUp : floorPositionYDown;
            var currentY = floorTransform.localPosition.y;
            var direction = (targetY - currentY) > 0 ? 1 : -1;
            var newY = currentY + direction * liftSpeed * Time.deltaTime;
            if (direction > 0 && newY > targetY || direction < 0 && newY < targetY)
            {
                newY = targetY;
                _liftState = _liftState == LiftState.GoingUp ? LiftState.Top : LiftState.Bottom;
                if (_liftState == LiftState.Bottom)
                {
                    PlayLidOpenClosing();
                    lidAnimator.Close();
                    onLiftBottom.Invoke();
                }
                else
                {
                    onLiftTop.Invoke();
                }
            }

            var liftDelta = newY - floorPositionYDown;
            floorTransform.localPosition = new Vector3(floorTransform.localPosition.x, newY, floorTransform.localPosition.z);

            if(liftedObjectTransform is not null)
                liftedObjectTransform.localPosition = new Vector3(liftedObjectTransform.localPosition.x, _liftedTransformBaseY + liftDelta, liftedObjectTransform.localPosition.z);
        }

        private void PlayLidOpenClosing()
        {
            if (lidOpenCloseSound is not null && lidOpenCloseSound.clip is not null)
            {
                if (lidOpenCloseSound.isPlaying)
                    lidOpenCloseSound.Stop();
                lidOpenCloseSound.Play();
            }
        }
        
        private void PlayLiftMoving()
        {
            if (liftMovingSound is not null && liftMovingSound.clip is not null)
            {
                if (!liftMovingSound.isPlaying)
                    liftMovingSound.Play();
            }
        }
        
        private void StopPlayingLiftMoving()
        {
            if (liftMovingSound is not null && liftMovingSound.clip is not null)
            {
                if (liftMovingSound.isPlaying)
                    liftMovingSound.Stop();
            }
        }

        public void ToggleLift()
        {
            switch (_liftState)
            {
                case LiftState.Bottom:
                case LiftState.GoingDown:
                    liftedObjectTransform.gameObject.SetActive(true);
                    boxTransform.gameObject.SetActive(true);
                    floorTransform.gameObject.SetActive(true);
                    _liftState = LiftState.GoingUp;
                    onLiftAscending.Invoke();
                    break;
                case LiftState.Top:
                case LiftState.GoingUp:
                    liftedObjectTransform.gameObject.SetActive(true);
                    boxTransform.gameObject.SetActive(true);
                    floorTransform.gameObject.SetActive(true);
                    _liftState = LiftState.GoingDown;
                    onLiftDescending.Invoke();
                    break;
                default:
                    _liftState = LiftState.Bottom;
                    break;
            }
        }
    }
}

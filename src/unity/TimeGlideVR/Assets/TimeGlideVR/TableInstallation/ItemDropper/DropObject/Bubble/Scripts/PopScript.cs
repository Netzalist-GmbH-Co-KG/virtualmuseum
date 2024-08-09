using System.Linq;
using UnityEngine;

namespace TimeGlideVR.TableInstallation.ItemDropper.Bubble.Scripts
{
    public class PopScript : MonoBehaviour
    {
        [SerializeField]
        private Bubble bubbleScript;
        public void OnTriggerEnter(Collider collisionWith){
            if(collisionWith.CompareTag("CollisionIgnore")) return;

            if(bubbleScript.ObjectInBubble == collisionWith.gameObject){
                return;
            }

            if(bubbleScript.ObjectInBubble)
            {
                if (bubbleScript.ObjectInBubble.transform.Cast<Transform>()
                    .Any(child => collisionWith.gameObject == child.gameObject))
                {
                    return;
                }
            }

            GetComponent<SphereCollider>().enabled = false;
            Debug.Log(collisionWith.name);
            bubbleScript.Pop();
        }
    }
}

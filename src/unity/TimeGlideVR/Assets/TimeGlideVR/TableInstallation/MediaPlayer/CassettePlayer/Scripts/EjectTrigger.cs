using UnityEngine;
using UnityEngine.Events;

public class EjectTrigger : MonoBehaviour
{
    [SerializeField]
    private UnityEvent onEject;
    public bool ready = false;
    
    public void OnTriggerEnter(){
        if(ready == false) return;
        ready = false;
        onEject.Invoke();
    }

    public void SetReady(){
        ready = true;
    }

    public void StartAnimation(){
        TryGetComponent<Animator>(out Animator anim);
        if(anim) anim.Play("Base Layer.EjectButton");
    }
}

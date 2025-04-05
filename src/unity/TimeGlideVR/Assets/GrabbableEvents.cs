using System.Collections.Generic;
using UnityEngine;
using Oculus.Interaction;
using Oculus.Interaction.HandGrab;
public class GrabbableEvents : MonoBehaviour
{
    private List<HandGrabInteractor> _interactors = new List<HandGrabInteractor>();
    private Grabbable _grabbable;

    private void Awake()
    {
        _grabbable = GetComponent<Grabbable>();
    }

    private void OnTriggerEnter(Collider collision)
    {
        if(collision.transform.parent == null) return;
        if(collision.transform.parent.gameObject.TryGetComponent(out HandGrabInteractor interactor))
        {
            Debug.Log($"Collision with {collision.gameObject.name}");
            if (interactor != null)
            {
                _interactors.Add(interactor);
            }
        }
    }

    private void OnTriggerExit(Collider collision)
    {
        if(collision.transform.parent.gameObject.TryGetComponent(out HandGrabInteractor interactor))
        {
            if (interactor != null)
            {
                _interactors.Remove(interactor);
            }
        }
    }

    public void Unselect()
    {
        foreach (HandGrabInteractor interactor in _interactors)
        {
            interactor.ForceRelease();
        }
    }

}

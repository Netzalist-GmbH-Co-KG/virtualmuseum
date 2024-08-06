using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FeatherFall : MonoBehaviour
{
    [SerializeField]
    private float maximumDownwardVelocity = 1f;
    [SerializeField]
    private TrailRenderer trailRenderer;
    private Rigidbody rb;
    private bool falling = false;
    /// <summary>
    /// This function is called when the object becomes enabled and active.
    /// </summary>
    private void OnEnable()
    {
        TryGetComponent<Rigidbody>(out var rb);
        if(rb){
            this.rb = rb;
            trailRenderer.enabled = true;
            StartCoroutine(WaitABit());
        }
    }

    /// <summary>
    /// Update is called every frame, if the MonoBehaviour is enabled.
    /// </summary>
    private void Update()
    {
        if(!rb || !falling) return;
        if(rb.velocity.y < -maximumDownwardVelocity) {
            rb.velocity = new Vector3(rb.velocity.x * 0.9f, -maximumDownwardVelocity, rb.velocity.z * 0.9f);
        }
    }

    public void OnDisable() {
        falling = false;
        trailRenderer.enabled = false;
        rb = null;
    }

    IEnumerator WaitABit(){
        yield return new WaitForSeconds(0.2f);
        falling = true;
    }
}

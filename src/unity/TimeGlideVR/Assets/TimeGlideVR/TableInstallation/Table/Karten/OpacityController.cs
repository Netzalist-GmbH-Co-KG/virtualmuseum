using UnityEngine;

namespace TimeGlideVR.TableInstallation.Table.Karten
{
    public class OpacityController : MonoBehaviour
    {
        private static readonly int AlphaOverride = Shader.PropertyToID("_alphaOverride");

        public void TryMakeTransparent(){
            var mr = GetComponent<MeshRenderer>();
            var mats = mr.materials;

            foreach(var mat in mats){
                try{
                    mat.SetFloat(AlphaOverride, 1f);
                } catch {
                }
            }
        }

        public void TryMakeOpaque(){
            var mr = GetComponent<MeshRenderer>();
            var mats = mr.materials;
            foreach(var mat in mats){
                try{
                    mat.SetFloat(AlphaOverride, 0f);
                } catch {
                }
            }
        }
    }
}

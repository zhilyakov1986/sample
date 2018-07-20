namespace API.CRUD
{
  public class CrudSearchFieldType
  {

    public string Name { get; set; }
    public Method Comparetype { get; set; }
    public enum Method { Equals = 0, Contains };

    public CrudSearchFieldType(string searchfield, Method comparetype)
    {
      this.Name = searchfield;
      this.Comparetype = comparetype;
    }



  }
}
